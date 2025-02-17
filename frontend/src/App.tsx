import {useEffect, useState} from 'react';
import './App.module.scss';
import axios from "axios";

function App() {
  const [info,setInfo] = useState<string[]>([]);

  useEffect(()=>{
    const get = async() => {

        const res: string[] = [];
        const urls = [
          "https://localhost/api/v1/reserve/",
          "https://localhost/api/v1/article/",
          "https://localhost/api/v1/scientist/",
          "https://localhost/api/v1/publisher/",
          "https://localhost/api/v1/product/",
          "https://localhost/api/v1/relationship/",
          "https://localhost/api/v1/logs/",
          "https://localhost/api/v1/chats/",
          "https://localhost/api/v1/basket/"
        ];

        for(let i in urls){
          const answer = await axios.get<{info:string}>(urls[i]);
          res.push(answer.data.info);
        }

        return res;
    }
    get()
    .then(res => {
      setInfo(state => [...res]);
    })
    .catch(err => {
      setInfo(state => [err.message+": "+err.stack])
    })
  },[info]);

  
  return (
    <div className="App">
      Hello suchki!
      <a href="https://localhost/api/v1/user/google">user for google</a>
      <ul>
        {info.map( (el, i)=>{
          return (
            <li key={"list: "+i}>{el}</li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
