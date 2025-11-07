"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ServiceSelector } from './ServiceSelector';
import { WorkTimeSelector } from './WorkTimeSelector';
import { MemberNumSelector } from './MemberNumSelector';
import { CategorySelector } from './CategorySelector';

export default function Searchbar() {
  const {
    keyword, setKeyword,
    service, setService,
    work_time, setWorkTime,
    member_num, setMemberNum,
    category, setCategory,
    setCurrentPage,
  } = useAppContext();

  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    if (keyword === searchInput.trim()) return;
    setKeyword(searchInput.trim());
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col gap-2 md:gap-4 py-2 px-2 md:px-4">
        <div className="flex flex-wrap gap-2 md:gap-4">
          <ServiceSelector value={service} onChange={(value: number) => setService(value)} />
          <WorkTimeSelector value={work_time} onChange={(value: number) => setWorkTime(value)} />
          <MemberNumSelector value={member_num} onChange={(value: number) => setMemberNum(value)} />
          <CategorySelector value={category} onChange={(value:number) => setCategory(value)} />
        </div>
        <div className="flex gap-2 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="サービスコードまたはサービス内容の入力"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} className="px-4 md:px-6 bg-main hover:opacity-80 text-white">
            検  索
          </Button>
        </div>
      </div>
    </div>
  );
}
