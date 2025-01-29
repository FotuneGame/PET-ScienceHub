import {useEffect, useState} from 'react';
import './App.module.scss';
import axios from "axios";

function App() {
  const [info,setInfo] = useState<string>("");

  useEffect(()=>{
    const get = async() => {
       return await axios.get<{info:string}>("https://localhost/api/v1/user/");
    }
    get()
    .then(res => {
      setInfo(state => res.data.info);
    })
    .catch(err => {
      setInfo(state => err)
    })
  },[info]);

  
  return (
    <div className="App">
      Hello suchki!
      <p>
        {info}
      </p>
    </div>
  );
}

export default App;
