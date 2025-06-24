import {useState,useEffect} from "react";
import axios from "axios";
import toast from "react-hot-toast"; 

interface Container {
  
  Id: string;
  Names: string[];
  Image: string;
  Status: string;
}

const App: React.FC = () => {

  const [container, setContainer] = useState<Container[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContainer = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/container');
      setContainer(res.data.containers);
      setError(null)
    } catch (error: any) {
      setError("Failed to load containers");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchContainer();
  },[]);

  const actionMap: {[key:string]:string}= {
    start: "Starting",
    stop: "Pausing",
    delete: "Deleting"
  }

  const handleAction = async (id:string, action:string,name:string) => {
    toast(`${name} is ${actionMap[action] || action}`)
    try {
      if (action === "delete") {
      await axios.delete(`http://localhost:8000/container/${id}`)
    }else{
      await axios.post(`http://localhost:8000/container/${id}/${action}`);
    }

    fetchContainer();
    } catch (error:any) {
      alert("Action Failed " + error.message)
    }
  }

  return(
    <>
      <div>
        <h1>Docker Dashboard</h1>
        {
          loading ? <p>Loading ...</p>: null
        }
        {
          error ?<p>{error}</p>: null
        }
        <table cellPadding={10} border={1}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Image</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
           {container.map((Container)=>{
             const currentStatus =  Container.Status;
           
           return(
            <tr key={Container.Id}>
              <td>{Container.Id.slice(0,12)}</td>
              <td>{Container.Names[0].replace('/','')}</td>
              <td>{Container.Image}</td>
              <td>{currentStatus}</td>
              <td>
                {
                  !currentStatus.startsWith("Up") ? (<button onClick={()=>handleAction(Container.Id, "start",Container.Names[0].replace('/',''))}>Start</button>) : (<button onClick={()=>handleAction(Container.Id, "stop",Container.Names[0].replace('/',''))}>Pause</button>)
                }
                
                <button onClick={()=>handleAction(Container.Id, "delete",Container.Names[0].replace('/',''))}>Delete</button>

              </td>
            </tr>

           )})

           }

          </tbody>
          
        </table>
      </div>
    </>
  )
}

export default App;