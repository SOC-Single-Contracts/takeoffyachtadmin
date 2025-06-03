import React, { useState, useEffect, useCallback } from "react"
import { Search, X, ShoppingBag, ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import ProductCard from "./ProductCard"
import { IconButton } from "@material-tailwind/react"
import { CustomPagination } from "../common/customPagination/customPagination"

// Adjust these constants to match your environment:
const PAGE_SIZE = 10
const baseUrl = "https://api.takeoffyachts.com" // ← use your actual base URL

const   ProductCatalog = ({ onSelectProduct }) => {
  // Top‐level: “Boats” or “Experiences”
  const [activeCategory, setActiveCategory] = useState("Boats")
  // Subcategory state (only used when activeCategory === "Boats")
  //  • Boats:    "regular" | "f1yachts"
  const [activeSubcategory, setActiveSubcategory] = useState("regular")

  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Data arrays
  const [boats, setBoats] = useState([])
  const [experiences, setExperiences] = useState([])

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Fetch “Boats” from API
  const fetchBoats = useCallback(
    async (pageToLoad = 1) => {
      setIsLoading(true)
      const payload = {
        reqType: "handlePagination",
        YachtType: activeSubcategory === "f1yachts" ? "f1yachts" : "regular",
        user_id: 1,
        name: searchQuery,
        page: pageToLoad
      }

      try {
        const response = await fetch(
          `${baseUrl}/yacht/check_yacht/?page=${pageToLoad}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        )
        const data = await response.json()

        if (data.error_code === "pass" && Array.isArray(data.data)) {
          const sortedData = data.data.sort(
            (a, b) =>
              new Date(b.yacht.created_on) - new Date(a.yacht.created_on)
          )
          // Only replace the boats array if it's the first page
          if (pageToLoad === 1) {
            setBoats(sortedData)
          } else {
            setBoats((prev) => [...prev, ...sortedData])
          }
          // Set total items and calculate total pages
          if (data.total_yachts) {
            setTotalItems(data.total_yachts)
            setTotalPages(Math.ceil(data.total_yachts / PAGE_SIZE))
          }
          setHasMore(sortedData.length >= PAGE_SIZE)
        } else {
          console.error("API Error (boats) response:", data)
          setBoats([])
          setHasMore(false)
          setTotalPages(1)
        }
      } catch (err) {
        console.error("Fetch error (boats):", err)
        setBoats([])
        setHasMore(false)
        setTotalPages(1)
      } finally {
        setIsLoading(false)
      }
    },
    [activeSubcategory, searchQuery]
  )

  // Fetch “Experiences” from API (always "regular")
  const fetchExperiences = useCallback(
    async (pageToLoad = 1) => {
      setIsLoading(true)
      const payload = {
        reqType: "handlePagination",
        experience_type: "regular",
        user_id: 1,
        experience_name: searchQuery,
        page: pageToLoad
      }

      try {
        const response = await fetch(
          `${baseUrl}/yacht/check_experience/?page=${pageToLoad}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        )
        const responseData = await response.json()

        if (
          responseData.success === true &&
          Array.isArray(responseData.experience)
        ) {
          const sortedData = responseData.experience.sort(
            (a, b) =>
              new Date(b.experience.created_on) -
              new Date(a.experience.created_on)
          )
          // Only replace the experiences array if it's the first page
          if (pageToLoad === 1) {
            setExperiences(sortedData)
          } else {
            setExperiences((prev) => [...prev, ...sortedData])
          }
          // Set total items and calculate total pages
          if (responseData.total_experience) {
            setTotalItems(responseData.total_experience)
            setTotalPages(Math.ceil(responseData.total_experience / PAGE_SIZE))
          }
          setHasMore(sortedData.length >= PAGE_SIZE)
        } else {
          console.error("API Error (experiences) response:", responseData)
          setExperiences([])
          setHasMore(false)
          setTotalPages(1)
        }
      } catch (err) {
        console.error("Fetch error (experiences):", err)
        setExperiences([])
        setHasMore(false)
        setTotalPages(1)
      } finally {
        setIsLoading(false)
      }
    },
    [searchQuery]
  )

  // Whenever category / subcategory / searchQuery changes:
  useEffect(() => {
    setPage(1)
    setHasMore(true)
    if (activeCategory === "Boats") {
      setExperiences([]) // clear experiences array
      fetchBoats(1)
    } else {
      setBoats([]) // clear boats array
      fetchExperiences(1)
    }
  }, [
    activeCategory,
    activeSubcategory,
    searchQuery,
    fetchBoats,
    fetchExperiences,
  ])

  // Load next page when page changes
  useEffect(() => {
    if (activeCategory === "Boats") {
      fetchBoats(page)
    } else {
      fetchExperiences(page)
    }
  }, [page, activeCategory, fetchBoats, fetchExperiences])

  // Pagination handlers
  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    }
  }

  // Decide which array to render
  const itemsToRender = activeCategory === "Boats" ? boats : experiences

  // Subcategory options (only for Boats)
  const subCategories =
    activeCategory === "Boats"
      ? [
          { label: "Regular Boats", value: "regular" },
          { label: "F1 Boats", value: "f1yachts" },
        ]
      : []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <ShoppingBag className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Product Catalog</DialogTitle>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search…"
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Top‐Level Tabs: Boats / Experiences */}
        <Tabs
          defaultValue="Boats"
          value={activeCategory}
          onValueChange={(val) => {
            setActiveCategory(val)
            setActiveSubcategory("regular")
          }}
          className="mb-4"
        >
          <TabsList>
            <TabsTrigger value="Boats" className="px-4">
              Boats
            </TabsTrigger>
            <TabsTrigger value="Experiences" className="px-4">
              Experiences
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Subcategory Tabs (only if Boats) */}
        {activeCategory === "Boats" && (
          <Tabs
            defaultValue="regular"
            value={activeSubcategory}
            onValueChange={setActiveSubcategory}
            className="mb-4"
          >
            <TabsList>
              {subCategories.map((sub) => (
                <TabsTrigger key={sub.value} value={sub.value} className="px-4">
                  {sub.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Scrollable Grid */}
        <div className="overflow-y-auto flex-1 pr-2">
          {isLoading && (
            <div className="flex-1 flex items-center justify-center py-8">
              <span className="text-gray-500">Loading...</span>
            </div>
          )}

          {!isLoading && (
            <div className="grid grid-cols-2 gap-4">
              {itemsToRender.map((item) => {
                // Extract “yacht” or “experience” record
                const record =
                  activeCategory === "Boats" ? item.yacht : item.experience

                // Build unified product shape
                const productShape = {
                  id: record.id,
                  name: record.name,
                  description: record.description || record.location,
                  price: record.per_hour_price,
                  image:
                    activeCategory === "Boats"
                      ? `https://api.takeoffyachts.com${record.yacht_image}`
                      : `https://api.takeoffyachts.com${record.experience_image}`,
                  category: activeCategory,
                  // Add flags for product type
                  is_regular_yacht: activeCategory === "Boats" && activeSubcategory === "regular",
                  is_f1_yacht: activeCategory === "Boats" && activeSubcategory === "f1yachts",
                  is_experience: activeCategory === "Experiences"
                }

                return (
                  <ProductCard
                    key={productShape.id}
                    product={productShape}
                    onSelect={() => {
                      onSelectProduct(productShape);
                      setOpen(false); // Close the dialog after selection
                    }}
                  />
                )
              })}
            </div>
          )}

          {!isLoading && itemsToRender.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No items found.
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && itemsToRender.length > 0 && (
            <div className="flex items-center justify-center mt-6 mb-2">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Page {page} of {totalPages}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={page === totalPages || totalPages === 0}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductCatalog
