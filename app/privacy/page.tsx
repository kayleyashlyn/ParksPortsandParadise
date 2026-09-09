import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/seo";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Parks Ports & Paradise collects, uses, and protects the information you share through this site.",
  path: "/privacy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What personal information we collect through this site, how we use it, and the choices you have."
    >
      <h2>1. Who we are</h2>
      <p>
        Parks Ports &amp; Paradise Travel Company (<strong>[LEGAL ENTITY NAME]</strong>,
        &ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) operates{" "}
        <span>parksportsandparadise.com</span> (the &ldquo;Site&rdquo;). This
        policy explains what personal information we collect through the Site, how
        we use it, and the choices you have.
      </p>
      <p>
        Questions:{" "}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ·{" "}
        <strong>[MAILING ADDRESS]</strong>.
      </p>
      <p>
        Florida Seller of Travel Ref. No. ST46356 · California Seller of Travel
        Reg. No. 2173719-70. (See the Terms of Service for what these
        registrations do and do not cover.)
      </p>

      <h2>2. Information we collect</h2>
      <p>
        <strong>Information you give us</strong>
      </p>
      <ul>
        <li>
          <strong>Vacation Request Form.</strong> First and last name, email
          address, phone number, the destinations you&rsquo;re interested in,
          preferred travel dates and date flexibility, budget range, whether
          you&rsquo;re celebrating an occasion, discount eligibility you tell us
          about (e.g. resident, military, annual passholder), trip priorities,
          the size of your party and <strong>the ages of travelers under 18</strong>{" "}
          as provided by the adult submitting the form, number of rooms needed,
          and how you heard about us. This is the only way to contact us through
          the Site &mdash; there is no separate contact form, and the Site takes
          no payments.
        </li>
        <li>
          <strong>Newsletter sign-up.</strong> Your email address, if you choose
          to subscribe.
        </li>
      </ul>
      <p>
        <strong>Information collected automatically</strong>
      </p>
      <ul>
        <li>
          <strong>Analytics.</strong> We use Google Analytics 4 to understand how
          the Site is used (pages viewed, general location, device and browser
          type, referring links, and a &ldquo;request submitted&rdquo; event when
          the Vacation Request Form is completed). Google sets cookies or similar
          identifiers to do this. See Section 6.
        </li>
        <li>
          <strong>Server and security logs.</strong> Our hosting provider records
          standard technical data such as IP address, request time, and user
          agent.
        </li>
        <li>
          <strong>Embedded content.</strong> The homepage may include an
          Instagram feed embedded via SnapWidget. When that section loads,
          SnapWidget (and Instagram) may receive your IP address and set their
          own cookies. We don&rsquo;t control those services&rsquo; data
          practices; see their privacy policies.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> knowingly collect payment card numbers, Social
        Security numbers, passport numbers, or government IDs through the Site.
      </p>

      <h2>3. How we use your information</h2>
      <ul>
        <li>
          To respond to your inquiry and have one of our travel advisors prepare
          a customized, no-obligation quote.
        </li>
        <li>
          To communicate with you about your trip planning by email or phone.
        </li>
        <li>
          To send you our newsletter, if you subscribed (you can unsubscribe at
          any time using the link in any newsletter email).
        </li>
        <li>
          To operate, secure, and improve the Site, and to measure how well it
          converts inquiries.
        </li>
        <li>To comply with law and enforce our Terms of Service.</li>
      </ul>
      <p>
        We do not use your information for automated decision-making that
        produces legal or similarly significant effects, and we do not sell or
        &ldquo;share&rdquo; your personal information for cross-context behavioral
        advertising (as those terms are defined under California law).
      </p>

      <h2>4. How we share your information</h2>
      <ul>
        <li>
          <strong>Our travel advisors.</strong> Your request is provided to the
          Parks Ports &amp; Paradise advisor(s) who will plan your trip.
        </li>
        <li>
          <strong>Vacation Creations.</strong> Our advisors use Vacation
          Creations, a third-party travel-agent platform, to build and process
          bookings. If you move forward with a trip, the details you provide (and
          additional details you give your advisor directly, such as traveler
          names and, at the booking stage, payment information provided to the
          supplier&rsquo;s own secure form) are entered there. The Site itself
          does not transmit payment information.
        </li>
        <li>
          <strong>Service providers that run the Site on our behalf</strong>,
          under contract and only as needed to provide their service:
          <ul>
            <li>
              <strong>Resend</strong> &mdash; delivers the notification email of
              your form submission to our business inbox.
            </li>
            <li>
              <strong>Vercel</strong> &mdash; website hosting and content
              delivery.
            </li>
            <li>
              <strong>Sanity</strong> &mdash; content management system for the
              Site&rsquo;s editorial content.
            </li>
            <li>
              <strong>Google</strong> &mdash; analytics (Google Analytics 4).
            </li>
            <li>
              <strong>SnapWidget</strong> &mdash; the embedded Instagram feed, if
              enabled.
            </li>
          </ul>
        </li>
        <li>
          <strong>Legal and safety.</strong> If required by law, subpoena, or to
          protect the rights, property, or safety of Parks Ports &amp; Paradise,
          our clients, or others.
        </li>
        <li>
          <strong>Business transfer.</strong> In connection with a merger,
          acquisition, or sale of assets, subject to this policy.
        </li>
      </ul>
      <p>We do not sell your personal information for money.</p>

      <h2>5. Children&rsquo;s privacy</h2>
      <p>
        The Site is intended for adults planning family travel. We do not
        knowingly collect personal information directly from children under 13.
        Where the Vacation Request Form asks for &ldquo;ages of anyone under
        18,&rdquo; we are collecting that information <strong>from the adult
        submitting the request</strong> so we can plan an appropriate trip &mdash;
        not from the child. If you believe a child has provided us information
        directly, contact us at{" "}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> and we will delete
        it.
      </p>

      <h2>6. Cookies and analytics</h2>
      <p>We use cookies and similar technologies for:</p>
      <ul>
        <li>
          <strong>Essential functions</strong> &mdash; needed for the Site to
          work.
        </li>
        <li>
          <strong>Analytics</strong> &mdash; Google Analytics 4, to measure usage
          and inquiry conversion.
        </li>
      </ul>
      <p>
        <strong>[If a consent banner is used:]</strong> When you first visit, you
        can accept or decline non-essential (analytics) cookies, and you can
        change your choice at any time via{" "}
        <strong>[the &ldquo;Cookie settings&rdquo; link in the footer]</strong>.
      </p>
      <p>
        You can also opt out of Google Analytics across all sites using
        Google&rsquo;s browser add-on:{" "}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="noopener noreferrer"
        >
          tools.google.com/dlpage/gaoptout
        </a>
        . Most browsers let you block or delete cookies in their settings; some
        features may not work as well if you do.
      </p>
      <p>
        We <strong>[do / do not]</strong> respond to Global Privacy Control (GPC)
        signals <strong>[describe]</strong>.
      </p>

      <h2>7. How long we keep your information</h2>
      <p>
        We keep Vacation Request Form submissions and related correspondence for
        as long as needed to plan and support your trip and for a reasonable
        period afterward for recordkeeping, dispute resolution, and legal
        compliance &mdash; generally <strong>[e.g. 3 years]</strong> after our
        last interaction, unless a longer period is required by law. Newsletter
        subscriptions are kept until you unsubscribe. Analytics data is retained
        per Google&rsquo;s settings (<strong>[e.g. 14 months]</strong>).
      </p>

      <h2>8. Your privacy rights</h2>
      <p>Depending on where you live, you may have the right to:</p>
      <ul>
        <li>
          <strong>Access / know</strong> what personal information we hold about
          you and how we use and disclose it.
        </li>
        <li>
          <strong>Correct</strong> inaccurate personal information.
        </li>
        <li>
          <strong>Delete</strong> your personal information.
        </li>
        <li>
          <strong>Opt out</strong> of sale or &ldquo;sharing&rdquo; for
          cross-context behavioral advertising &mdash; we do not do either, so
          there is nothing to opt out of.
        </li>
        <li>
          <strong>Not be discriminated against</strong> for exercising these
          rights.
        </li>
      </ul>
      <p>
        <strong>California residents (CCPA/CPRA):</strong> the categories of
        personal information we collect are identifiers (name, email, phone, IP),
        commercial information (your travel preferences and inquiry), internet
        activity (analytics), and geolocation (approximate, from IP). We collect
        it for the purposes in Section 3, disclose it to the parties in Section
        4, and do not sell or share it. You may make a rights request as
        described below; we will verify your identity before responding, and you
        may use an authorized agent.
      </p>
      <p>
        To exercise any right, email{" "}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with the subject
        &ldquo;Privacy Request,&rdquo; or write to{" "}
        <strong>[MAILING ADDRESS]</strong>. We will respond within the time
        required by applicable law.
      </p>

      <h2>9. Security</h2>
      <p>
        We use reasonable administrative and technical safeguards to protect your
        information, including HTTPS for the Site and access controls for our
        systems. No method of transmission or storage is completely secure, and
        we cannot guarantee absolute security.
      </p>

      <h2>10. Third-party sites and services</h2>
      <p>
        The Site links to third-party sites (for example, an external Agent
        Portal and our Instagram profile) and embeds third-party content (the
        SnapWidget Instagram feed). We are not responsible for the privacy
        practices of those services; review their policies directly.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will post the updated
        version here with a new &ldquo;Last updated&rdquo; date and, if the
        changes are material, provide a more prominent notice.
      </p>

      <h2>12. Contact us</h2>
      <p>
        <strong>[LEGAL ENTITY NAME]</strong>
        <br />
        <strong>[MAILING ADDRESS]</strong>
        <br />
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <br />
        <strong>[PHONE]</strong>
      </p>
    </LegalPage>
  );
}
