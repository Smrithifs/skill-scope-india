
import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";
import { InternshipFilter as FilterType } from '@/types';
import { internshipCategories, indianCities, indianStates } from '@/data/mockData';

interface InternshipFilterProps {
  onFilterChange: (filter: FilterType) => void;
  currentFilter: FilterType;
}

const InternshipFilter = ({ onFilterChange, currentFilter }: InternshipFilterProps) => {
  const handleCategoryChange = (value: string) => {
    onFilterChange({ ...currentFilter, category: value });
  };

  const handleCityChange = (value: string) => {
    onFilterChange({ ...currentFilter, city: value });
  };

  const handleDurationChange = (value: number[]) => {
    onFilterChange({ ...currentFilter, duration: value[0] });
  };

  const handleStipendChange = (value: number[]) => {
    onFilterChange({
      ...currentFilter,
      stipendMin: value[0] * 1000,
      stipendMax: value[1] * 1000
    });
  };

  const handleRemoteChange = (checked: boolean) => {
    onFilterChange({ ...currentFilter, isRemote: checked });
  };

  const resetFilters = () => {
    onFilterChange({});
  };

  // Convert stipend to slider values (in thousands)
  const minStipend = currentFilter.stipendMin ? currentFilter.stipendMin / 1000 : 0;
  const maxStipend = currentFilter.stipendMax ? currentFilter.stipendMax / 1000 : 50;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-medium">Category</AccordionTrigger>
          <AccordionContent>
            <Select 
              value={currentFilter.category || 'All'} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {internshipCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger className="text-sm font-medium">Location</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="city" className="text-xs text-gray-500 mb-1 block">City</Label>
                <Select 
                  value={currentFilter.city || 'All'} 
                  onValueChange={handleCityChange}
                >
                  <SelectTrigger className="w-full" id="city">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote"
                  checked={currentFilter.isRemote}
                  onCheckedChange={handleRemoteChange}
                />
                <Label htmlFor="remote" className="text-sm">Remote only</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="duration">
          <AccordionTrigger className="text-sm font-medium">Duration</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="duration" className="text-xs text-gray-500">Maximum duration</Label>
                  <span className="text-xs text-gray-500">
                    {currentFilter.duration || 6} months
                  </span>
                </div>
                <Slider
                  id="duration"
                  defaultValue={[currentFilter.duration || 6]}
                  max={12}
                  min={1}
                  step={1}
                  onValueChange={handleDurationChange}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stipend">
          <AccordionTrigger className="text-sm font-medium">Stipend</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="stipend" className="text-xs text-gray-500">Range (₹ thousands)</Label>
                  <span className="text-xs text-gray-500">
                    ₹{minStipend}K - ₹{maxStipend}K
                  </span>
                </div>
                <Slider
                  id="stipend"
                  defaultValue={[minStipend, maxStipend]}
                  max={50}
                  min={0}
                  step={1}
                  onValueChange={handleStipendChange}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6">
        <Button 
          className="w-full bg-brand-500 hover:bg-brand-600" 
          onClick={() => onFilterChange({...currentFilter})}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default InternshipFilter;
