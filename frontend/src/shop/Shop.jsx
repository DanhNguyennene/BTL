import React, {useState, useCallback} from 'react'
import SearchBar from '../components/SearchBar'
import BookLists from '../components/BookLists'


const Shop = () => {

  const {search, setSearch} = useState('')

  const handleSearch = useCallback((searchItem) => {
    setSearch(searchItem);
  }, []);

  

  return (
    <>
    <div>dasd</div>
    </>
  )
}

export default Shop