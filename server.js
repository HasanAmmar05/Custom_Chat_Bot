const express = require('express');
const Groq = require('groq-sdk');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

const realEstateData = {
  KLCC: {
    overview:
      'KLCC is the heart of Kuala Lumpur, known for its iconic Petronas Twin Towers and luxurious lifestyle.',
    condos: {
      avgPrice: 'RM 1,500 per sqft',
      priceRange: 'RM 1,000,000 - RM 20,000,000+',
      popularCondos: [
        {
          name: 'Four Seasons Place',
          price: 'RM 2,500 - 3,500 per sqft',
          size: '1,098 - 7,039 sqft',
          image: '/images/fourseasons-place.jpg',
          amenities: ['Private lift lobby', 'Infinity pool', 'Spa', 'Fitness center'],
          yearBuilt: 2018,
          developer: 'Venus Assets Sdn Bhd',
        },
        {
          name: 'The Troika',
          price: 'RM 1,800 - 2,500 per sqft',
          size: '2,228 - 21,000 sqft',
          image: '/images/the-troika.jpg',
          amenities: ['Sky gymnasium', 'Landscaped gardens', 'BBQ area', 'Business center'],
          yearBuilt: 2010,
          developer: 'BRDB Developments',
        },
        {
          name: 'Banyan Tree Signatures',
          price: 'RM 2,000 - 3,000 per sqft',
          size: '1,076 - 6,512 sqft',
          image: '/images/banyan-tree-signatures.jpg',
          amenities: ['Infinity pool', 'Sky bar', 'Banyan Tree spa', 'Concierge services'],
          yearBuilt: 2016,
          developer: 'Lumayan Indah Sdn Bhd',
        },
      ],
      rentalYield: '3.5% - 5% per annum',
      tenantProfile: 'Expatriates, high-income professionals, corporate leases',
    },
    houses: {
      avgPrice: 'RM 1,000,000 - 5,000,000+',
      popularAreas: ['Ampang Hilir', 'U-Thant', 'Taman U-Thant'],
      sampleListings: [
        {
          type: 'Bungalow',
          price: 'RM 15,000,000',
          size: '8,000 sqft',
          location: 'Ampang Hilir',
          landArea: '10,000 sqft',
          bedrooms: 6,
          bathrooms: 7,
          features: ['Private pool', 'Garden', 'Home theater', 'Smart home system'],
        },
        {
          type: 'Semi-detached',
          price: 'RM 5,500,000',
          size: '4,500 sqft',
          location: 'U-Thant',
          landArea: '3,500 sqft',
          bedrooms: 5,
          bathrooms: 5,
          features: ['Rooftop terrace', 'Modern kitchen', 'Walk-in closet', 'Security system'],
        },
      ],
      schoolsNearby: ['The International School of Kuala Lumpur', 'Sayfol International School'],
      amenities: ['KLCC Park', 'Suria KLCC shopping mall', 'Royal Selangor Golf Club'],
    },
  },
  Bangsar: {
    condos: {
      avgPrice: 'RM 850 per sqft',
      popularCondos: [
        {
          name: 'Serai',
          price: 'RM 1,000 - 1,500 per sqft',
          size: '2,228 - 3,714 sqft',
          image: '/images/serai.jpg',
        },
        {
          name: 'Nadi Bangsar',
          price: 'RM 900 - 1,200 per sqft',
          size: '441 - 1,130 sqft',
          image: '/images/nadi-bangsar.jpg',
        },
        {
          name: 'Novum',
          price: 'RM 800 - 1,100 per sqft',
          size: '647 - 1,441 sqft',
          image: '/images/novum.jpg',
        },
      ],
    },
    houses: {
      avgPrice: 'RM 2,000,000 - 10,000,000+',
      popularAreas: ['Bangsar Park', 'Bukit Bandaraya', 'Bangsar Baru'],
      sampleListings: [
        {
          type: 'Bungalow',
          price: 'RM 12,000,000',
          size: '6,000 sqft',
          location: 'Bukit Bandaraya',
        },
        {
          type: 'Semi-detached',
          price: 'RM 4,500,000',
          size: '3,500 sqft',
          location: 'Bangsar Park',
        },
      ],
    },
  },
  Ampang: {
    houses: {
      avgPrice: 'RM 1,500,000 - 8,000,000+',
      popularAreas: ['Ampang Hilir', 'Taman TAR', 'Taman Ampang Utama'],
      sampleListings: [
        {
          type: 'Bungalow',
          price: 'RM 7,500,000',
          size: '7,000 sqft',
          location: 'Ampang Hilir',
        },
        {
          type: 'Semi-detached',
          price: 'RM 3,500,000',
          size: '3,500 sqft',
          location: 'Taman TAR',
        },
        {
          type: 'Terrace',
          price: 'RM 1,800,000',
          size: '3,000 sqft',
          location: 'Taman Ampang Utama',
        },
      ],
    },
  },
};

const marketTrends = {
  overall: {
    priceGrowth: '3.5% year-over-year',
    demandHotspots: ['KLCC', 'Bangsar', 'Mont Kiara'],
    investmentOutlook: 'Positive, with steady appreciation expected in prime areas',
  },
  luxuryMarket: {
    trend: 'Increasing demand from both local and foreign investors',
    popularTypes: ['Branded residences', 'Smart homes', 'Eco-friendly developments'],
  },
  affordableHousing: {
    initiatives: ['Residensi Wilayah', 'Rumah Selangorku'],
    locations: ['Sepang', 'Rawang', 'Semenyih'],
  },
};

app.post('/api/chat', async (req, res) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `
You are an advanced real estate assistant. You provide detailed information on properties, streets, and neighborhoods in Kuala Lumpur, Selangor, Putrajaya, and Cyberjaya.

**Guidelines:**
1. Use clear headings, bullet points, and tables.
2. Format currency as RM X,XXX,XXX.
3. Present data in structured formats with images and summaries.
4. Use **bold** and *italic* text for emphasis.
5. Conclude with key takeaways or a summary.`,
        },
        { role: 'user', content: req.body.message },
      ],
      model: 'llama3-8b-8192',
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      n: 1,
    });

    const response = chatCompletion.choices[0]?.message?.content || '';

    res.json({ message: response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
