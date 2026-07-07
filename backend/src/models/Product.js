import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    shortDescription: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    discountPrice: {
      type: Number,
      min: 0
    },
    images: [
      {
        url: String,
        publicId: String
      }
    ],
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    unit: {
      type: String,
      enum: ["Kg", "Gram", "Piece", "Dozen", "Bundle"],
      default: "Kg"
    },
    availability: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    origin: String,
    nutritionHighlights: [String],
    keywords: [String]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.virtual("finalPrice").get(function getFinalPrice() {
  return this.discountPrice ?? this.price;
});

productSchema.index({ name: "text", description: "text", keywords: "text" });

productSchema.pre("save", function setSlug(next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;

