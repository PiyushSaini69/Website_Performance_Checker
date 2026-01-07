import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Links from './Links'
import FileUpload from './Component/FileUpload'
import InputURL from './Component/InputURL'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <Routes>
        <Route path="/" element={<Links />} />
        <Route path="/FileUpload" element={<FileUpload />} />
        <Route path="/InputURL" element={<InputURL />} />
      </Routes>
      {/* <InputURL/>
    <FileUpload/> */}
    </>
  )
}

export default App
