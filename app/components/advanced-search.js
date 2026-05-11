"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, Calendar, DollarSign, User, Tag, Clock } from "lucide-react";

export default function AdvancedSearch({ data, onFilter, placeholder = "Search transactions..." }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    token: "all",
    dateRange: "all",
    amountRange: "all"
  });

  const filterOptions = {
    status: [
      { value: "all", label: "All Status" },
      { value: "confirmed", label: "Confirmed" },
      { value: "pending", label: "Pending" },
      { value: "failed", label: "Failed" }
    ],
    type: [
      { value: "all", label: "All Types" },
      { value: "sent", label: "Sent" },
      { value: "received", label: "Received" }
    ],
    token: [
      { value: "all", label: "All Tokens" },
      { value: "SOL", label: "SOL" },
      { value: "USDC", label: "USDC" }
    ],
    dateRange: [
      { value: "all", label: "All Time" },
      { value: "today", label: "Today" },
      { value: "week", label: "This Week" },
      { value: "month", label: "This Month" }
    ],
    amountRange: [
      { value: "all", label: "All Amounts" },
      { value: "small", label: "< 0.1 SOL" },
      { value: "medium", label: "0.1 - 1 SOL" },
      { value: "large", label: "> 1 SOL" }
    ]
  };

  const filteredData = useMemo(() => {
    let filtered = data || [];

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.message?.toLowerCase().includes(searchLower) ||
          item.signature?.toLowerCase().includes(searchLower) ||
          item.from?.toLowerCase().includes(searchLower) ||
          item.to?.toLowerCase().includes(searchLower) ||
          item.amount?.toString().includes(searchLower) ||
          item.token?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // Type filter
    if (filters.type !== "all") {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    // Token filter
    if (filters.token !== "all") {
      filtered = filtered.filter(item => item.token === filters.token);
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.timestamp);
        
        switch (filters.dateRange) {
          case "today":
            return itemDate >= today;
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return itemDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return itemDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Amount range filter
    if (filters.amountRange !== "all") {
      filtered = filtered.filter(item => {
        const amount = parseFloat(item.amount);
        
        switch (filters.amountRange) {
          case "small":
            return amount < 0.1;
          case "medium":
            return amount >= 0.1 && amount <= 1;
          case "large":
            return amount > 1;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [data, searchTerm, filters]);

  useEffect(() => {
    onFilter(filteredData);
  }, [filteredData, onFilter]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      type: "all",
      token: "all",
      dateRange: "all",
      amountRange: "all"
    });
    setSearchTerm("");
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "all") || searchTerm;

  const getFilterIcon = (filterType) => {
    switch (filterType) {
      case "status":
        return <Clock className="w-4 h-4" />;
      case "type":
        return <User className="w-4 h-4" />;
      case "token":
        return <DollarSign className="w-4 h-4" />;
      case "dateRange":
        return <Calendar className="w-4 h-4" />;
      case "amountRange":
        return <Tag className="w-4 h-4" />;
      default:
        return <Filter className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition-colors"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 top-3 p-1.5 rounded-lg transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-primary/20 text-primary"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mt-2 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Advanced Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(filterOptions).map(([filterType, options]) => (
                <div key={filterType}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <select
                    value={filters[filterType]}
                    onChange={(e) => handleFilterChange(filterType, e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:border-primary/50 focus:outline-none transition-colors"
                  >
                    {options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Active Filters:</h4>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                      <Search className="w-3 h-3" />
                      "{searchTerm}"
                    </span>
                  )}
                  {Object.entries(filters).map(([filterType, value]) => {
                    if (value === "all") return null;
                    const option = filterOptions[filterType].find(opt => opt.value === value);
                    return (
                      <span key={filterType} className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                        {getFilterIcon(filterType)}
                        {option?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          {filteredData.length} {filteredData.length === 1 ? 'result' : 'results'} found
        </span>
        {hasActiveFilters && (
          <span>
            from {data?.length || 0} total
          </span>
        )}
      </div>
    </div>
  );
}
