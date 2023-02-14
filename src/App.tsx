import React, { useState } from "react";
import "./index.scss";
import { Collection } from "./pages/Collection";

const cats = [
  { name: "Все" },
  { name: "Море" },
  { name: "Горы" },
  { name: "Архитектура" },
  { name: "Города" },
];
type CollectionsType = {
  category: number;
  name: string;
  photos: string[];
};
const App: React.FC = () => {
  const [categoryId, setCategoryId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [collections, setCollections] = useState<CollectionsType[]>([]);
  React.useEffect(() => {
    setIsLoading(true);
    const category = categoryId ? `category=${categoryId}` : "";
    const pageParam = fetch(
      `https://63d3bb81a93a149755b16e08.mockapi.io/photo_collctions?page=${page}&limit=3&${category}`
    )
      .then((res) => res.json())
      .then((json) => {
        setCollections(json);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при полчении фотографий");
      })
      .finally(() => setIsLoading(false));
  }, [categoryId, page]);
  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {cats.map((c, index) => (
            <li
              onClick={() => setCategoryId(index)}
              className={categoryId === index ? "active" : ""}
              key={c.name}
            >
              {c.name}
            </li>
          ))}
        </ul>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          placeholder="Поиск по названию"
        />
      </div>
      <div className="content">
        {isLoading ? (
          <h2>Loading...</h2>
        ) : (
          collections
            .filter((c) => {
              return c.name.toLowerCase().includes(searchValue.toLowerCase());
            })
            .map((c, index) => (
              <Collection key={index} name={c.name} images={c.photos} />
            ))
        )}
      </div>
      <ul className="pagination">
        {[...Array(5)].map((_, i) => (
          <li
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? "active" : ""}
          >
            {i + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
