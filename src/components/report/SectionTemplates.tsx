import React from "react";
import {
  X,
  FileText,
  BarChart3,
  Image,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  MapPin,
  CreditCard,
} from "lucide-react";

interface SectionTemplatesProps {
  onAddSection: (type: string) => void;
  onClose: () => void;
}

const SectionTemplates: React.FC<SectionTemplatesProps> = ({
  onAddSection,
  onClose,
}) => {
  const templates = [
    {
      type: "executive_summary",
      title: "Executive Summary",
      description: "High-level business insights and key performance overview",
      icon: FileText,
      color: "indigo",
    },
    {
      type: "divider",
      title: "Divider Section",
      description:
        "A section to visually separate content with a title and number",
      icon: FileText,
      color: "blue",
    },
    {
      type: "opening",
      title: "Opening Section",
      description: "Introductory section with key highlights",
      icon: FileText,
      color: "indigo",
    },
    {
      type: "sales_overview",
      title: "Sales Overview",
      description: "Comprehensive sales performance analysis",
      icon: DollarSign,
      color: "blue",
    },
    {
      type: "platform_sales_value",
      title: "Platform Sales Value",
      description: "Sales value analysis across platforms",
      icon: DollarSign,
      color: "purple",
    },
    {
      type: "volume_sales_value",
      title: "Volume Sales Value",
      description: "Sales volume analysis by product categories",
      icon: BarChart3,
      color: "emerald",
    },
    {
      type: "store_sales_value",
      title: "Store Sales Value",
      description: "Sales value analysis by store performance",
      icon: ShoppingCart,
      color: "orange",
    },
    {
      type: "brand_performance_platform",
      title: "Brand Performance by Platform",
      description: "Analysis of brand performance across platforms",
      icon: DollarSign,
      color: "blue",
    },
    {
      type: "brand_performance_sub_category",
      title: "Brand Performance by Subcategory",
      description: "Detailed brand performance in subcategories",
      icon: DollarSign,
      color: "purple",
    },
    {
      type: "top_listing_performance",
      title: "Top Listing Performance",
      description: "Performance analysis of top listings",
      icon: DollarSign,
      color: "emerald",
    },
    {
      type: "top_categories",
      title: "Top Categories Performance",
      description: "Detailed analysis of top-performing product categories",
      icon: DollarSign,
      color: "red",
    },
    {
      type: "top_reseller",
      title: "Top Reseller Performance",
      description: "Analysis of top resellers and their performance",
      icon: ShoppingCart,
      color: "green",
    },
    {
      type: "flashsale",
      title: "Flash Sale Performance",
      description: "Analysis of flash sale events and their impact",
      icon: ShoppingCart,
      color: "orange",
    },
    {
      type: "banner",
      title: "Banner Performance",
      description: "Analysis of banner performance across platforms",
      icon: Image,
      color: "blue",
    },
    {
      type: "top_brand_channel",
      title: "Top Brand on Each Channel",
      description: "Top Brand on Each Channel",
      icon: BarChart3,
      color: "green",
    },
    // NEW CSV-BASED SECTIONS
    {
      type: "customer_performance",
      title: "Customer Performance Analysis",
      description: "Comprehensive customer analysis with retention insights",
      icon: Users,
      color: "blue",
    },
    {
      type: "product_insights",
      title: "Product Performance Insights",
      description: "Product analysis with pricing and trend insights",
      icon: Package,
      color: "green",
    },
    {
      type: "seasonal_patterns",
      title: "Seasonal Sales Patterns",
      description: "Monthly and seasonal sales trend analysis",
      icon: Calendar,
      color: "purple",
    },
    {
      type: "geographic_intelligence",
      title: "Geographic Sales Intelligence",
      description: "Location-based sales performance and market penetration",
      icon: MapPin,
      color: "emerald",
    },
    {
      type: "payment_terms",
      title: "Payment Terms Analysis",
      description: "Payment terms impact and customer preference analysis",
      icon: CreditCard,
      color: "orange",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200",
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
      pink: "bg-pink-50 text-pink-600 border-pink-200",
      green: "bg-green-50 text-green-600 border-green-200",
      red: "bg-red-50 text-red-600 border-red-200",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="flex flex-col bg-white border-l border-gray-200 w-80">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Section Templates
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 transition-colors duration-200 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      </div>

      {/* Templates */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.type}
                onClick={() => onAddSection(template.type)}
                className="w-full p-4 text-left transition-all duration-200 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg border ${getColorClasses(
                      template.color
                    )}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* <SectionTitle title={template.title} /> */}
                    <p className="text-xs leading-relaxed text-gray-500">
                      {template.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          Select a template to add a new section to your report
        </p>
      </div>
    </div>
  );
};

export default SectionTemplates;
