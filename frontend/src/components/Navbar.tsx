import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import { X, Menu } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-[#f0f2f4] dark:border-gray-800 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="px-6 lg:px-12 flex h-16 items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-primary">
            <h2 className="text-text-main dark:text-white text-lg font-bold tracking-tight">
              Logo
            </h2>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#workflow"
              className="text-text-main dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors"
            >
              Workflow
            </a>
            <a
              href="#security"
              className="text-text-main dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors"
            >
              Security
            </a>
            <a
              href="#pricing"
              className="text-text-main dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <ModeToggle />

            <Link to="/login" className="hidden sm:inline-block">
              <Button
                
                className="hover:cursor-pointer h-9 px-4 border-0 rounded-lg bg-[#137fec] hover:bg-[#0b5cb3] text-white font-medium transition-colors"
              >
                Log In
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center size-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white dark:bg-black w-64 shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-text-main dark:text-white">
              Menu
            </h3>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center size-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 px-6 py-4 flex flex-col gap-2">
            <a
              href="#workflow"
              className="text-text-main dark:text-gray-300 text-sm font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors py-3 px-3 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Workflow
            </a>
            <a
              href="#security"
              className="text-text-main dark:text-gray-300 text-sm font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors py-3 px-3 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Security
            </a>
            <a
              href="#pricing"
              className="text-text-main dark:text-gray-300 text-sm font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors py-3 px-3 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>

            <div className="border-t border-gray-100 dark:border-gray-800 my-3"></div>

            <Link
              to="/login"
              className="text-text-main dark:text-gray-300 text-sm font-medium hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors py-3 px-3 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
