import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  website: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data: any = {};
    let isFormUrlEncoded = false;

    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      isFormUrlEncoded = true;
      const formData = await request.formData();
      const rawData = Object.fromEntries(formData.entries());

      // Extract and format fields from different landing page forms
      let nameVal = (rawData.name as string) || "";
      if (!nameVal.trim()) {
        if (rawData.type === "migration_request") {
          nameVal = "Migration Client";
        } else if (rawData.email) {
          nameVal = (rawData.email as string).split("@")[0];
        } else {
          nameVal = "Website Client";
        }
      }

      const websiteVal = (rawData.website || rawData.url || "") as string;
      const budgetVal = (rawData.budget || rawData.volume || rawData.traffic || rawData.host || "") as string;

      // Construct a detailed message combining specific form fields
      const messageParts = [
        rawData.message as string,
        rawData.company ? `Company: ${rawData.company}` : "",
        rawData.current_host ? `Current Host: ${rawData.current_host}` : "",
        rawData.new_host ? `New Host: ${rawData.new_host}` : "",
        rawData.type ? `Inquiry Type: ${rawData.type}` : "",
      ];
      const messageVal = messageParts.filter(Boolean).join("\n");

      data = {
        name: nameVal,
        email: rawData.email,
        website: websiteVal || undefined,
        budget: budgetVal || undefined,
        message: messageVal,
      };
    } else {
      data = await request.json();
    }

    const parsed = contactSchema.safeParse(data);

    if (!parsed.success) {
      if (isFormUrlEncoded) {
        const referer = request.headers.get("referer") || "/";
        const redirectUrl = new URL(referer);
        redirectUrl.searchParams.set("status", "error");
        return NextResponse.redirect(redirectUrl.toString().split("#")[0] + "#audit", 303);
      }
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, website, budget, message } = parsed.data;

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "hello@naveengaur.com",
      replyTo: email,
      subject: `New enquiry from ${name} — naveengaur.com`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAFAF8; border-radius: 8px;">
          <h2 style="color: #0D0D0D; font-size: 22px; margin-bottom: 24px;">New Portfolio Enquiry</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px; width: 120px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;"><a href="mailto:${email}" style="color: #C4A35A;">${email}</a></td>
            </tr>
            ${
              website
                ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px;">Website</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;"><a href="${website}" style="color: #C4A35A;">${website}</a></td>
            </tr>`
                : ""
            }
            ${
              budget
                ? `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #4A4A4A; font-size: 14px;">Budget / Detail</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; color: #0D0D0D; font-size: 14px;">${budget}</td>
            </tr>`
                : ""
            }
          </table>

          <div style="margin-top: 24px;">
            <p style="color: #4A4A4A; font-size: 14px; margin-bottom: 8px;">Message details:</p>
            <div style="background: white; border: 1px solid #EAEAEA; border-radius: 6px; padding: 16px; color: #0D0D0D; font-size: 14px; line-height: 1.65; white-space: pre-wrap;">${message}</div>
          </div>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #EAEAEA; font-size: 12px; color: #9A9A9A;">
            Sent from naveengaur.com contact form
          </div>
        </div>
      `,
    });

    if (isFormUrlEncoded) {
      const referer = request.headers.get("referer") || "/";
      const redirectUrl = new URL(referer);
      redirectUrl.searchParams.set("status", "success");
      // Redirect back to original page at the target anchor
      return NextResponse.redirect(redirectUrl.toString().split("#")[0] + "#audit", 303);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    const contentType = request.headers.get("content-type") || "";
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const referer = request.headers.get("referer") || "/";
      const redirectUrl = new URL(referer);
      redirectUrl.searchParams.set("status", "error");
      return NextResponse.redirect(redirectUrl.toString().split("#")[0] + "#audit", 303);
    }
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
