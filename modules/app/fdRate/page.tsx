"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Shadcn UI Components (Assuming they are installed in @/components/ui)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const FdRates = () => {
  const [fdRates, setFdRates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
 

  const itemsPerPage = 10;

  const fetchRates = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/fd-rates/");
      setFdRates(data);
    } catch (error) {
      console.error("Error fetching FD rates:", error);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = fdRates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(fdRates.length / itemsPerPage);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Fixed Deposit Rates
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Compare interest rates across commercial and development banks.
            </p>
          </div>

        </header>

        {/* Comparison Table Mode */}
        {(
          <div className="rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold ">S.N</TableHead>
                  <TableHead className="font-bold ">Bank Name</TableHead>
                  <TableHead className="font-bold  text-center">Type</TableHead>
                  <TableHead className="text-center">3 Months</TableHead>
                  <TableHead className="text-center">6 Months</TableHead>
                  <TableHead className="text-center font-black">
                    1 Year
                  </TableHead>
                  <TableHead className="text-center">2 Years+</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((rate, index) => (
                  <TableRow key={rate.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {indexOfFirstItem + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {rate.bank_name}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="default"
                        className="font-semibold uppercase text-[10px]"
                      >
                        {rate.bank_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {rate.rate_3_month}%
                    </TableCell>
                    <TableCell className="text-center">
                      {rate.rate_6_month}%
                    </TableCell>
                    <TableCell className="text-center font-bold bg-muted/20">
                      {rate.rate_1_year}%
                    </TableCell>
                    <TableCell className="text-center">
                      {rate.rate_2_year}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) }

        {/* Pagination using Shadcn Buttons */}
        <footer className="flex flex-col items-center gap-4 pt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "ghost"}
                  size="sm"
                  className="w-9"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, fdRates.length)} of {fdRates.length}{" "}
            banks
          </p>
        </footer>
      </div>
    </div>
  );
};

export default FdRates;
