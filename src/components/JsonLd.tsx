import React from 'react';

interface LocalBusinessSchemaProps {
  type: 'LocalBusiness';
  name: string;
  description: string;
  url: string;
  logo: string;
  telephone: string;
  priceRange: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressCountry: string;
  };
}

interface ProductSchemaProps {
  type: 'Product';
  name: string;
  description: string;
  image: string;
  offers: {
    price: number;
    priceCurrency: string;
    availability: string;
  };
}

type JsonLdProps = LocalBusinessSchemaProps | ProductSchemaProps;

export default function JsonLd(props: JsonLdProps) {
  let schemaData: any = {};

  if (props.type === 'LocalBusiness') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      'name': props.name,
      'description': props.description,
      'url': props.url,
      'logo': props.logo,
      'telephone': props.telephone,
      'priceRange': props.priceRange,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': props.address.streetAddress,
        'addressLocality': props.address.addressLocality,
        'addressCountry': props.address.addressCountry,
      },
      'slogan': 'Votre alimentation saine, notre priorité.',
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          'opens': '08:00',
          'closes': '19:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': 'Sunday',
          'opens': '09:00',
          'closes': '14:00',
        },
      ],
    };
  } else if (props.type === 'Product') {
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': props.name,
      'description': props.description,
      'image': props.image,
      'offers': {
        '@type': 'Offer',
        'price': props.offers.price,
        'priceCurrency': props.offers.priceCurrency,
        'availability': props.offers.availability === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'url': 'https://ampktfwcpopkomrsckjm.supabase.co', // fallbacks
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
