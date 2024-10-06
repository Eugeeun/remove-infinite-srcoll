import { useEffect, useState, useRef } from 'react';
import { MockData, getMockData } from './utils/getMockData';
import styles from './App.module.css';

const App = () => {
  const [data, setData] = useState<MockData[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [total, setTotal] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMoreData = async (pageNum: number) => {
    if (page === 0 || isLoading) return;

    setIsLoading(true);
    const { datas, isEnd } = await getMockData(pageNum);
    setData(prev => [...prev, ...datas]);
    setIsEnd(isEnd);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMoreData(page);
  }, [page]);

  useEffect(() => {
    setTotal(data.reduce((acc, cur) => acc + cur.price, 0));
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading && !isEnd) setPage(prev => prev + 1);
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [isLoading, isEnd]);

  return (
    <div className={styles.app}>
      <p className={styles.total}>총계: {total}</p>
      <div className={styles.itemCon}>
        {data.map(d => (
          <div key={d.productId} className={styles.item}>
            <p>{d.productName}</p>
            <p>{d.price}</p>
            <p>{d.boughtDate}</p>
          </div>
        ))}
        {isLoading && !isEnd && <p>로딩중...</p>}
        {isEnd && <p>로드할 데이터가 없습니다.</p>}
        <div ref={loadMoreRef} style={{ height: '1px' }} />
      </div>
    </div>
  );
};

export default App;
