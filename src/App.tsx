import React, { useEffect, useState } from 'react';
import './App.css';
import Ball from './components/Ball';
import Papa from "papaparse";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

function App() {
    const [num, setNum] = useState('');
    // This state will store the parsed data
    const [data, setData] = useState([] as { [key: string]: string }[]);
    const [error, setError] = useState('');
    const [lotteryError, setLotteryError] = useState('');
    // Winner
    const [winner, setWinner] = useState<{[key:string]:string}|null>(null);
    
    const lottery = () => {
        setNum('');
        setWinner(null);
        setLotteryError('');
        const winnerObj = data.find(d => d['shomare-ghoreh'] === num);
        
        if (!winnerObj) {
            setLotteryError(`شماره قرعه ${num} یافت نشد`);
        }
        else {
            winnerObj!['num'] = num;
        }
        
        setWinner(winnerObj!);
    }
    
    
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const key = parseInt(e.key);
            
            if (isNaN(key)) {
                if (e.key === 'Enter' && num.length === 3)
                {
                    lottery();
                }
                return;
            }
            
            if (num.length === 3)
            {
                setNum(key.toString());
            }
            else
            {
                setNum(num + key.toString())
            }
        }
        
        document.addEventListener('keydown', handleKeyDown);
        
        // Don't forget to clean up
        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [num]);
    
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        
        // Check if the user has entered the file
        if (e.target.files?.length) {
            const inputFile = e.target.files[0];
            
            // Check the file extensions, if it is not
            // included in the allowed extensions
            // then we show the error
            const fileExtension =
                      inputFile?.name.toLowerCase().split(".")[1];
            if (
                !allowedExtensions.includes(fileExtension)
            ) {
                setError("Please input a csv file");
                return;
            }
    
            const reader = new FileReader();
    
            // Event listener on reader when the file
            // loads, we parse it and set the data.
            reader.onload = async ({ target }) => {
                // @ts-ignore
                const csv = Papa.parse(target.result as string, {
                    header: true,
                });
                const parsedData = ((csv as any)?.data as { [key: string]: string }[])
                    .filter(d => 'shomare-ghoreh' in d && 'name' in d);

                if (parsedData.length === 0)
                {
                    setError("No rows read. Your csv file must have following column names: \"shomare-ghoreh\" & \"name\"");
                }
                setData(parsedData);
            };
            reader.readAsText(inputFile);
        }
    }

  return (
    <div className="App">
      <header className="absolute sticky top-0 z-50 text-green-200 bg-black">
          <p className="text-lg text-[#51BDE8]">سامانه قرعه کشی جشن نفس</p>
          <p className="text-sm text-[#66D147]">انجمن اهدای عضو ایرانیان</p>
      </header>
        <div className={ (data.length === 0 ? '' : 'hidden ') + "absolute bg-opacity-80 z-20 p-40 bg-black w-screen h-screen flex-col flex text-center justify-center content-center items-center" }>
            <div className="bg-gray-100 border-4 rounded-3xl w-full h-full text-center justify-center content-center items-center" style={{direction: 'rtl'}}>
                <div className="text-gray-700 text-right px-10">
                    <p>
                        لطفا فایل CSV شامل اطلاعات مدعوین محترم را بارگذاری کنید:
                    </p>
                    <p>
                        فایل بایستی حتما دارای ستون های shomare-ghoreh و name باشد. همچنین ستون های field1 و field2 اختیاری است و در صورت وجود برای فرد برنده عینا نمایش داده خواهد شد.
                    </p>
                </div>
                <input
                    type="file"
                    name="file"
                    onChange={changeHandler}
                    accept=".csv"
                    className="pt-10 block m-auto" />
                {
                    error
                        ? (<div className="sticky bottom-0 text-4xl bg-black z-20 text-red-700">{error}</div>)
                        : undefined
                }
            </div>
        </div>
      <main className="h-screen w-full bg-gray-900">
        <div className="flex flex-row align-center content-center text-center items-center justify-center m-0">

            <Ball num={parseInt(num[0]) as -1|0|1|2|3|4|5|6|7|8|9} size={400} />
            <Ball num={parseInt(num[1]) as -1|0|1|2|3|4|5|6|7|8|9} size={400} />
            <Ball num={parseInt(num[2]) as -1|0|1|2|3|4|5|6|7|8|9} size={400} />

        </div>
          {
              winner ? (
                  <div className="py-6 w-full flex flex-col bg-blue-900 text-3xl text-white *:pb-4 first:*:bg-white first:*:bg-opacity-20 first:*:rounded-full last:*:pb-0">
                      <div className="">{winner['num']}</div>
                      <div className="">{winner['name']}</div>
                      {winner['field1'] ? (<div className="">{winner['field1']}</div>) : undefined}
                      {winner['field2'] ? (<div className="">{winner['field2']}</div>) : undefined}
                  </div>
              ) : undefined
          }
          {
              lotteryError.length > 0 ? (
                <div className="sticky h-16 align-middle text-center justify-center content-center items-center bg-red-800 text-white text-2xl">
                    {lotteryError}
                </div>
              ) : undefined
          }

      </main>
        <footer className="sticky bottom-0">
            {
                data.length > 0 ? (
                    <div className=" bg-gray-300 text-green-700 text-2xl" style={{direction: 'rtl'}}>
                        شماره قرعه قابل قبول از <span className="text-blue-600">{Math.min.apply(Math, data.map(v => parseInt(v['shomare-ghoreh'])))}</span> تا <span className="text-blue-600">{Math.max.apply(Math, data.map(v => parseInt(v['shomare-ghoreh'])))}</span> می باشد.
                    </div>
                ) : undefined
            }
        </footer>
    </div>
  );
}

export default App;
