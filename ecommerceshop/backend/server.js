import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || `http://localhost:${PORT}`,
        'http://localhost:5173', // Development frontend
        'http://localhost:3000'  // Alternative development port
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data for nature products
const products = [
    {
        id: uuidv4(),
        name: "Japanese Maple Leaves",
        category: "Decorative Leaves",
        description: "Beautiful red and orange maple leaves perfect for autumn decorations",
        price: 15.99,
        currency: "USD",
        inStock: true,
        quantity: 50,
        characteristics: {
            color: "Red/Orange",
            size: "Medium (3-5 inches)",
            season: "Autumn",
            origin: "Japan",
            preservation: "Pressed and dried",
            uses: ["Decoration", "Crafts", "Botanical art"]
        },
        images: [
            "/images/japanese-maple-1.svg",
            "/images/japanese-maple-2.svg"
        ],
        tags: ["maple", "autumn", "decorative", "japanese", "leaves"]
    },
    {
        id: uuidv4(),
        name: "English Oak Sapling",
        category: "Trees & Saplings",
        description: "Young English Oak tree, perfect for landscaping and reforestation",
        price: 45.00,
        currency: "USD",
        inStock: true,
        quantity: 25,
        characteristics: {
            height: "12-18 inches",
            age: "2 years",
            potSize: "3 gallon",
            hardiness: "Zones 3-8",
            matureHeight: "50-80 feet",
            soilType: "Well-drained, acidic to neutral",
            sunlight: "Full sun to partial shade",
            growthRate: "Slow to moderate"
        },
        images: [
            "/images/oak-sapling-1.svg",
            "/images/oak-sapling-2.svg"
        ],
        tags: ["oak", "tree", "sapling", "landscaping", "native"]
    },
    {
        id: uuidv4(),
        name: "Lavender Seed Collection",
        category: "Seeds & Starters",
        description: "Premium lavender seeds for aromatic gardens and natural wellness",
        price: 8.50,
        currency: "USD",
        inStock: true,
        quantity: 100,
        characteristics: {
            variety: "English Lavender (Lavandula angustifolia)",
            seedCount: "50 seeds per packet",
            germinationRate: "85-90%",
            bloomTime: "Summer",
            plantHeight: "12-24 inches",
            spacing: "12-18 inches apart",
            soilRequirements: "Well-drained, alkaline",
            uses: ["Aromatherapy", "Culinary", "Landscaping", "Potpourri"]
        },
        images: [
            "/images/lavender-seeds-1.svg",
            "/images/lavender-field.svg"
        ],
        tags: ["lavender", "seeds", "aromatic", "herbs", "purple"]
    },
    {
        id: uuidv4(),
        name: "Pine Cone Collection - Mixed Sizes",
        category: "Natural Decorative Items",
        description: "Assorted pine cones collected from various coniferous trees",
        price: 12.75,
        currency: "USD",
        inStock: true,
        quantity: 75,
        characteristics: {
            types: ["Scots Pine", "Norway Spruce", "White Pine"],
            sizes: "Small (1-2 inches) to Large (4-6 inches)",
            quantity: "25 pieces per collection",
            condition: "Natural, cleaned and dried",
            season: "Year-round availability",
            uses: ["Home decoration", "Crafts", "Fire starters", "Natural potpourri"]
        },
        images: [
            "/images/pinecones-mixed.svg",
            "/images/pinecones-craft.svg"
        ],
        tags: ["pinecones", "decoration", "natural", "crafts", "winter"]
    },
    {
        id: uuidv4(),
        name: "Eucalyptus Branch Bundle",
        category: "Decorative Leaves",
        description: "Fresh eucalyptus branches with aromatic silver-green leaves",
        price: 22.00,
        currency: "USD",
        inStock: true,
        quantity: 30,
        characteristics: {
            species: "Silver Dollar Eucalyptus",
            length: "18-24 inches",
            branchCount: "5-7 branches per bundle",
            freshness: "Cut within 48 hours",
            fragrance: "Strong, therapeutic aroma",
            lifespan: "2-3 weeks fresh, can be dried",
            uses: ["Floral arrangements", "Aromatherapy", "Shower eucalyptus", "Wedding decor"]
        },
        images: [
            "/images/eucalyptus-bundle.svg",
            "/images/eucalyptus-arrangement.svg"
        ],
        tags: ["eucalyptus", "aromatic", "fresh", "spa", "wellness"]
    },
    {
        id: uuidv4(),
        name: "Wildflower Meadow Mix",
        category: "Seeds & Starters",
        description: "Native wildflower seed mix for creating natural meadow gardens",
        price: 18.99,
        currency: "USD",
        inStock: true,
        quantity: 60,
        characteristics: {
            coverage: "500 square feet",
            flowerTypes: ["Black-eyed Susan", "Purple Coneflower", "Wild Bergamot", "Cosmos"],
            bloomSeason: "Spring through Fall",
            height: "1-4 feet mixed heights",
            soilType: "Adaptable to most soil types",
            maintenance: "Low maintenance once established",
            benefits: ["Pollinator friendly", "Drought tolerant", "Native species"]
        },
        images: [
            "/images/wildflower-mix.svg",
            "/images/meadow-bloom.svg"
        ],
        tags: ["wildflowers", "meadow", "native", "pollinator", "seeds"]
    }
];

// Routes
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        service: 'ecommerceshop-backend',
        timestamp: new Date().toISOString()
    });
});

// Get all products
app.get('/api/products', (req, res) => {
    const { category, tag, search } = req.query;
    
    let filteredProducts = [...products];
    
    // Filter by category
    if (category) {
        filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase().includes(category.toLowerCase())
        );
    }
    
    // Filter by tag
    if (tag) {
        filteredProducts = filteredProducts.filter(product =>
            product.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
        );
    }
    
    // Search in name and description
    if (search) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    res.json({
        products: filteredProducts,
        total: filteredProducts.length,
        categories: [...new Set(products.map(p => p.category))],
        tags: [...new Set(products.flatMap(p => p.tags))]
    });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
});

// Get categories
app.get('/api/categories', (req, res) => {
    const categories = [...new Set(products.map(p => p.category))];
    res.json(categories);
});

// Get featured products (for homepage)
app.get('/api/featured', (req, res) => {
    // Return first 3 products as featured
    const featured = products.slice(0, 3);
    res.json(featured);
});

// Serve static files from React build
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Handle React routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🌿 Nature E-Commerce Backend running on port ${PORT}`);
    console.log(`📁 API available at http://localhost:${PORT}/api`);
    console.log(`❤️  Health check at http://localhost:${PORT}/health`);
    console.log(`🌐 Frontend served at http://localhost:${PORT}`);
});
