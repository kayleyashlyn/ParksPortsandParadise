import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/seo";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms that govern your use of the Parks Ports & Paradise website and the Vacation Request Form.",
  path: "/terms",
});

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="The terms that govern your use of this site and the Vacation Request Form."
    >
      <h2>1. Agreement</h2>
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of{" "}
        <span>parksportsandparadise.com</span> (the &ldquo;Site&rdquo;), operated
        by Parks Ports &amp; Paradise Travel Company (<strong>[LEGAL ENTITY
        NAME]</strong>, &ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;). By
        using the Site or submitting a Vacation Request Form, you agree to these
        Terms and to our Privacy Policy. If you do not agree, do not use the
        Site.
      </p>

      <h2>2. What we do</h2>
      <p>
        Parks Ports &amp; Paradise is a <strong>travel advisory</strong>. We help
        you plan trips and, when you choose to move forward, our advisors
        facilitate bookings with third-party travel suppliers (for example,
        cruise lines, resorts, theme-park vacation packages, hotels, and
        airlines) through the Vacation Creations agent platform. We are{" "}
        <strong>not</strong> the operator of any transportation, lodging, tour,
        park, or other travel service, and we are not a party to your contract
        with those suppliers.
      </p>
      <p>
        Florida Seller of Travel Ref. No. ST46356 · California Seller of Travel
        Reg. No. 2173719-70. <strong>[Add any other registrations, e.g.
        additional state Seller of Travel numbers, as applicable.]</strong> These
        registrations are required licenses to sell travel in those states; they
        are not an endorsement or guarantee of any trip.
      </p>

      <h2>3. No booking or payment on this Site</h2>
      <p>
        The Site is <strong>inquiry-only</strong>. You cannot book, hold, or pay
        for travel on the Site. Submitting the Vacation Request Form starts a
        conversation with an advisor; it does not create a reservation. Any
        booking, deposit, or payment happens later, directly with the supplier or
        through the supplier&rsquo;s own secure payment process, subject to that
        supplier&rsquo;s terms and cancellation policies.
      </p>

      <h2>4. Quotes and pricing</h2>
      <p>
        Quotes we provide are estimates based on the information you give us and
        on supplier pricing and availability <strong>at the time of the
        quote</strong>. Prices, availability, itineraries, taxes, fees, and
        supplier promotions can change at any time until a booking is confirmed
        and paid. Nothing on the Site or in a quote is an offer that we&rsquo;re
        obligated to honor.
      </p>

      <h2>5. Fees</h2>
      <p>
        <strong>[Choose one and delete the other:]</strong>
      </p>
      <p>
        <strong>[Option A &mdash; no fees:]</strong> We are compensated by the
        travel suppliers we book with, and we do not charge you a separate
        planning or service fee for standard trip planning.
      </p>
      <p>
        <strong>[Option B &mdash; fees apply:]</strong> We may charge a planning
        or service fee for certain trips (for example, <strong>[complex
        multi-supplier itineraries]</strong>). Any fee will be disclosed to you
        in writing and agreed before you are charged. Fees are{" "}
        <strong>[refundable / non-refundable] [describe]</strong>.
      </p>

      <h2>6. Your responsibilities</h2>
      <p>You agree to:</p>
      <ul>
        <li>
          Provide accurate and complete information in your request and to your
          advisor.
        </li>
        <li>
          Ensure every traveler has valid travel documents (passport, visas,
          entry permits) and meets all health and entry requirements for the
          destination. These are your responsibility, not ours.
        </li>
        <li>
          Review all booking confirmations, supplier terms, and cancellation
          policies before paying, and promptly report any errors.
        </li>
        <li>
          Consider travel insurance. We strongly recommend it; you accept the
          risk of declining it.
        </li>
      </ul>

      <h2>7. Third-party suppliers</h2>
      <p>
        Your travel is provided by third-party suppliers under <strong>their</strong>{" "}
        terms and conditions, including their pricing, change, cancellation,
        refund, baggage, and conduct policies. We are not responsible for the
        acts, errors, omissions, representations, warranties, breaches, or
        negligence of any supplier, or for any injury, death, damage, delay, or
        loss arising from them, including events beyond anyone&rsquo;s reasonable
        control (weather, strikes, mechanical issues, government actions, health
        emergencies, and similar).
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        The Site and its content &mdash; text, design, logos, and the &ldquo;Parks
        Ports &amp; Paradise&rdquo; name and marks &mdash; are owned by us or our
        licensors and are protected by intellectual-property laws. You may use
        the Site for your personal, non-commercial trip-planning purposes only.
        Do not copy, scrape, republish, or use our content or marks without our
        prior written permission.
      </p>

      <h2>9. Acceptable use</h2>
      <p>
        Do not use the Site to submit false information, to submit another
        person&rsquo;s personal information without authorization, to interfere
        with the Site&rsquo;s operation or security, or for any unlawful purpose.
        We use automated and manual measures to filter spam and abusive
        submissions.
      </p>

      <h2>10. Disclaimers</h2>
      <p>
        The Site is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo;
        To the fullest extent permitted by law, we disclaim all warranties,
        express or implied, including merchantability, fitness for a particular
        purpose, and non-infringement, and we do not warrant that the Site will
        be uninterrupted, error-free, or secure, or that any quote, date, or
        price will remain available.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, <strong>[LEGAL ENTITY NAME]</strong>{" "}
        and its owners, employees, and agents will not be liable for any
        indirect, incidental, special, consequential, or punitive damages, or for
        lost profits or lost enjoyment, arising out of or relating to the Site or
        our services. Our total liability for any claim relating to our
        trip-planning services will not exceed the planning or service fees you
        paid us for the trip at issue (or, if no such fee was paid,{" "}
        <strong>[USD $100]</strong>). Some jurisdictions do not allow certain
        limitations, so parts of this section may not apply to you.
      </p>

      <h2>12. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless <strong>[LEGAL ENTITY NAME]</strong>{" "}
        and its owners, employees, and agents from any claims, damages, losses,
        and expenses (including reasonable attorneys&rsquo; fees) arising from
        your misuse of the Site, your violation of these Terms, or your violation
        of any law or third-party right.
      </p>

      <h2>13. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of the State of <strong>[STATE]</strong>,
        without regard to its conflict-of-laws rules. The exclusive venue for any
        dispute is the state or federal courts located in{" "}
        <strong>[COUNTY, STATE]</strong>, and you consent to their jurisdiction.{" "}
        <strong>[Optional: arbitration / class-action-waiver clause &mdash;
        discuss with counsel.]</strong>
      </p>

      <h2>14. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Changes are effective when
        posted here with a new &ldquo;Last updated&rdquo; date; for material
        changes we will provide a more prominent notice. Your continued use of
        the Site after changes means you accept them.
      </p>

      <h2>15. Contact</h2>
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
