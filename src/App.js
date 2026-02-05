import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TodoApp from './TodoApp';

const SEPOLIA_CHAIN_ID = '0xaa36a7'


function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const contractAddress = "0x8996830A9B65a60F46666eA744420539ba50bA48";
  const contractABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_todoId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        }
      ],
      "name": "addToDo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllTodos",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        },
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_todoId",
          "type": "uint256"
        }
      ],
      "name": "getTodoWithId",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            }
          ],
          "internalType": "struct TodoList.Todo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_todoId",
          "type": "uint256"
        }
      ],
      "name": "removeTodo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  async function ensureSepolia() {
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId"
    });

    if (currentChainId !== SEPOLIA_CHAIN_ID) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }]
      })
    }
  }

  const addTodoHandler = async (form) => {
    if (!window.ethereum) throw new Error("MetaMask not found");
    await ensureSepolia();
    console.log("Ensured Sepolia Network")
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    console.log("Signer:", signer);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contract.addToDo(form.id, form.title, form.description);
    console.log("Tx hash", tx.hash);
    await tx.wait();
    console.log("Successfully Todo Added!");
  }

  const deleteTodoHandler = async (id) => {
    if (!window.ethereum) throw new Error("MetaMask not found");
    await ensureSepolia();
    console.log("Ensured Sepolia Network")
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    console.log("Signer:", signer);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contract.removeTodo(id);
    console.log("Tx hash", tx.hash);
    await tx.wait();
    console.log("Successfully deleted!");
  }


  const fetchTodos = async () => {
    setLoading(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    console.log("Signer:", signer);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const [ids, titles, descriptions] = await contract.getAllTodos();
    const tempTodos = [];
    for (let i = 0; i < ids.length; i++) {
      console.log(i);
      tempTodos.push({ id: ids[i], title: titles[i], description: descriptions[i] });
    }
    setTodos(tempTodos);
    setLoading(false);
  }

  useEffect(() => {
    fetchTodos();
  }, [])

  return loading ? <div className='app'><h1>Loading...</h1></div> : (
    <TodoApp todos={todos} fetchTodos={fetchTodos} addTodoHandler={addTodoHandler} deleteTodoHandler={deleteTodoHandler} />
  );
}

export default App;
