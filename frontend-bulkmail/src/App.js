import { useState } from "react"
import './App.css'
import axios from 'axios'
import * as XLSX from 'xlsx'

function App() {
  const [msg, setmsg] = useState('')
  const [status, setstatus] = useState(false)
  const [fileName, setFileName] = useState('No file chosen')
  const [emailCount, setEmailCount] = useState(0)
  const [emailList, setemailList] = useState('')

  const handlemsg = (event) => {
    setmsg(event.target.value)
  }

  const handlemail = (event) => {
    const file = event.target.files[0]
    
    if (file) {
      setFileName(file.name) // Set the filename to display it
    } else {
      setFileName('No file chosen') // Reset if no file chosen
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      const data = event.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetname = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetname]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" })

      setEmailCount(emailList.length);  // Set the total number of emails
      const totalemail = emailList.map((data) => { return (data.A) })
      setemailList(totalemail)
    }
    reader.readAsBinaryString(file);
  }

  const send = () => {
    setstatus(true)
    axios.post('http://localhost:5000/sendmail', { msg: msg, emailList: emailList })
      .then((data) => {
        if (data.data === true) {
          alert("Email sent!")
          setstatus(false)
        } else {
          alert("Email Failed to send")
        }
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center animate-slide-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 transform transition duration-700 ease-in-out hover:scale-105 hover:shadow-2xl animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4 animate-pulse">BulkMail Service</h1>
        <p className="text-gray-600 mb-6 text-lg">Easily send multiple emails at once</p>

        <textarea
          placeholder="Enter the email text..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500 hover:shadow-lg"
          onChange={handlemsg}
          value={msg}>
        </textarea>

        <div className="flex items-center mb-6 space-x-2">
          <label htmlFor="fileinput" className="cursor-pointer bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transform transition-all duration-300 hover:scale-110">
            Choose File
          </label>
          <input type="file" id="fileinput" className="hidden" onChange={handlemail}></input>
          <p id="fileName" className="ml-2 text-gray-600">{fileName}</p>
        </div>

        <div id="email-count" className="text-gray-600 mb-4 text-sm">
          Total Emails in the file: <span className="font-semibold">{emailCount}</span>
        </div>

        <button 
          className={`w-full py-3 rounded-lg text-white ${status ? 'bg-gray-400' : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400'} transform transition-all duration-500 hover:scale-105 hover:shadow-lg`}
          onClick={send}
          disabled={status}>
          {status ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}


export default App;
