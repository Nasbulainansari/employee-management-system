function SearchBar({ search, setSearch }) {

    return (

        <div className="mb-6">

            <input
                type="text"
                placeholder="Search Employee..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                className="border rounded-lg p-3 w-full"
            />

        </div>

    );

}

export default SearchBar;