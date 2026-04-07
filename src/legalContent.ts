export type LegalPageKey = 'privacy' | 'terms' | 'disclosures';

type LegalSection = {
  heading: string;
  paragraphs: string[];
};

type LegalPage = {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const legalPages: Record<LegalPageKey, LegalPage> = {
  privacy: {
    title: 'Privacy Policy',
    description: 'How EmeTruth collects, uses, and protects information shared through this website.',
    lastUpdated: 'April 7, 2026',
    sections: [
      {
        heading: 'Scope',
        paragraphs: [
          'This Privacy Policy applies to information collected through the EmeTruth website and direct inquiries submitted through the website contact flow.',
          'It does not govern third-party services, venue APIs, or counterparties unless stated separately in a written agreement.',
        ],
      },
      {
        heading: 'Information We Collect',
        paragraphs: [
          'We may collect contact details, company information, and message content that you choose to submit through the website or by email.',
          'We may also collect limited technical information such as browser type, approximate location, referring pages, and basic analytics needed to operate and improve the site.',
        ],
      },
      {
        heading: 'How We Use Information',
        paragraphs: [
          'We use submitted information to respond to inquiries, evaluate potential commercial fit, schedule conversations, and maintain basic business records.',
          'We may also use information to improve site operations, protect against abuse, and comply with legal or regulatory obligations.',
        ],
      },
      {
        heading: 'Sharing',
        paragraphs: [
          'We do not sell personal information submitted through the site.',
          'We may share information with service providers that support hosting, analytics, communications, legal review, or security, and only to the extent reasonably necessary to operate the business.',
        ],
      },
      {
        heading: 'Retention and Security',
        paragraphs: [
          'We retain inquiry information only for as long as reasonably necessary for business, legal, or compliance purposes.',
          'We use commercially reasonable administrative and technical safeguards, but no internet transmission or storage system is guaranteed to be fully secure.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'For privacy questions or requests, contact partners@emetruth.capital.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Use',
    description: 'Basic terms governing use of the EmeTruth website.',
    lastUpdated: 'April 7, 2026',
    sections: [
      {
        heading: 'Website Use',
        paragraphs: [
          'This website is provided for general informational purposes about EmeTruth and its services.',
          'You may use the site only in compliance with applicable law and may not misuse, disrupt, scrape at abusive rates, or interfere with site operations.',
        ],
      },
      {
        heading: 'No Offer or Advice',
        paragraphs: [
          'Nothing on this site constitutes investment advice, legal advice, a solicitation to buy or sell securities, or a commitment to enter into any transaction or commercial relationship.',
          'Any engagement with EmeTruth is subject to separate written agreements, diligence, and approvals.',
        ],
      },
      {
        heading: 'Accuracy',
        paragraphs: [
          'We aim to keep information on the site accurate and current, but we do not guarantee completeness, accuracy, or uninterrupted availability.',
          'We may change, suspend, or remove content from the site at any time without notice.',
        ],
      },
      {
        heading: 'Intellectual Property',
        paragraphs: [
          'Unless otherwise noted, the content, branding, and materials on this site are owned by EmeTruth or its licensors and may not be copied or reused without permission.',
        ],
      },
      {
        heading: 'Limitation of Liability',
        paragraphs: [
          'To the maximum extent permitted by law, EmeTruth is not liable for indirect, incidental, special, or consequential damages arising from use of the site.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'Questions regarding these terms can be directed to partners@emetruth.capital.',
        ],
      },
    ],
  },
  disclosures: {
    title: 'Regulatory and Business Disclosures',
    description: 'General business disclosures relating to the EmeTruth website and communications.',
    lastUpdated: 'April 7, 2026',
    sections: [
      {
        heading: 'General Information Only',
        paragraphs: [
          'This website is intended to describe EmeTruth’s business and capabilities at a high level.',
          'It is not intended as a public filing, regulated disclosure document, research report, or offer memorandum.',
        ],
      },
      {
        heading: 'Forward-Looking Statements',
        paragraphs: [
          'Statements about expected market development, platform outcomes, commercial opportunities, or future capabilities are inherently uncertain and may change without notice.',
        ],
      },
      {
        heading: 'Commercial Relationships',
        paragraphs: [
          'References to operators, venues, counterparties, external data relationships, or strategic partners do not imply endorsement or a public commercial relationship unless expressly stated.',
        ],
      },
      {
        heading: 'Performance and Metrics',
        paragraphs: [
          'Operational or volume-related statements are presented for business context only. They do not represent investment returns, guarantees of future performance, or a solicitation for capital.',
        ],
      },
      {
        heading: 'Jurisdiction and Compliance',
        paragraphs: [
          'Availability of services may depend on jurisdiction, legal review, venue requirements, and internal compliance considerations.',
          'Nothing on this website should be interpreted as confirming availability of services in every jurisdiction or under every regulatory framework.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'For business or disclosure questions, contact partners@emetruth.capital.',
        ],
      },
    ],
  },
};
