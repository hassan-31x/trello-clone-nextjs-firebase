import { useEffect, useState } from 'react';

type Content = string;
type SampleItem = {
  id: number;
  content: Content[];
};

const generateRandomContent = (): Content[] => {
  const randomLength = Math.floor(Math.random() * 4) + 1;
  return Array.from({ length: randomLength }, (_, index) => `Element ${index + 1}`);
};

const Loader: React.FC = () => {
  const [sampleArray, setSampleArray] = useState<SampleItem[]>([]);

  useEffect(() => {
    const generateSampleArray = () => {
      const newArray: SampleItem[] = Array.from({ length: 7 }, (_, index) => ({
        id: index + 1,
        content: generateRandomContent()
      }));
      setSampleArray(newArray);
    };

    generateSampleArray();
  }, []);

  return (
    <div className="flex flex-wrap gap-5 max-w-7xl mx-auto mt-10 px-2 md:px-10">
      {sampleArray.map((el) => (
        <div className="p-2 w-60 px-3 py-3 min-w-[250px] rounded-2xl bg-[#F1F2F4]" key={el.id}>
          <div className="w-[50%] h-3 rounded-md skeleton opacity-70 ml-2 mb-3 mt-2" />

          <div className="w-[30%] h-2 mb-2 rounded-md skeleton opacity-70 ml-2" />

          {el.content.map((_, index) => ( // Removed `el2` from arguments
            <div className="rounded-xl my-2 flex items-center px-3 py-2 bg-[#F1F2F4] note" key={index}>
              <div
                className="skeleton h-[0.9rem] mb-1 rounded-md opacity-70 ml-3"
                style={{ width: `${Math.floor(Math.random() * (90 - 30 + 1)) + 30}px` }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Loader;
