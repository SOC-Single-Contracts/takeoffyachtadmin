import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'

const ProductCard = ({ product, onSelect }) => {
  // If price is undefined or null, default to 0
  const priceNumber = product.price ?? 0
  
  // Handle click with all product properties
  const handleClick = () => {
    // Make sure we pass the complete product object with all properties
    onSelect(product);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-3 flex-1">
        <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
        <p className="text-sm font-bold mt-1">
          ${priceNumber.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button
          onClick={handleClick}
          className="w-full bg-[#BEA355] hover:bg-[#9a8544] text-white"
          size="sm"
        >
          Send in Chat
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
