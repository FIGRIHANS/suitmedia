'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Suitmedia. All rights reserved.</p>
      </div>
    </footer>
  );
}