import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import SearchResult from "./components/SerachResults/SearchResult";

export const BASE_URL = "http://localhost:9000";
const App = () => {
    const [foodData, setFoodData] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedBtn, setSelectedBtn] = useState("all");

    const fetchFoodData = async () => {
        setLoading(true);
        try {
            const response = await fetch(BASE_URL);
            const data = await response.json();
            setFoodData(data);
            setFilterData(data);
            setLoading(false);
        } catch (error) {
            setError("Unable to fetch data");
        }
    };

    useEffect(() => {
        fetchFoodData();
    }, []);

    const searchFoodItems = (e) => {
        const searchItem = e.target.value;

        if (searchItem === "") {
            setFilterData(null);
        }

        const filterData = foodData?.filter((item) =>
            item.name.toLowerCase().includes(searchItem.toLowerCase())
        );

        setFilterData(filterData);
    };

    const filterFoodItemsUsingBtn = (type) => {
        if (type === "all") {
            setFilterData(foodData);
            setSelectedBtn("all");
            return;
        }

        const filterData = foodData?.filter((item) =>
            item.type.toLowerCase().includes(type.toLowerCase())
        );

        setFilterData(filterData);
        setSelectedBtn(type);
    };

    // If error occurs
    if (error) return <div>{error}</div>;

    // Show loading while data is being fetched
    if (loading) return <div>Loading...</div>;

    const filterBtns = [
        { name: "All", type: "all" },
        { name: "Breakfast", type: "breakfast" },
        { name: "Lunch", type: "lunch" },
        { name: "Dinner", type: "dinner" },
    ];

    return (
        <>
            <Container>
                <TopContainer>
                    <div className="logo">
                        <img src="/logo.svg" alt="logo" />
                    </div>
                    <div className="search">
                        <input
                            onChange={searchFoodItems}
                            placeholder="Search Food Items..."
                        />
                    </div>
                </TopContainer>
                <FilterContainer>
                    {filterBtns.map(({ name, type }) => (
                        <Button
                            $isSelected={selectedBtn === type}
                            key={name}
                            onClick={() => filterFoodItemsUsingBtn(type)}
                        >
                            {name}
                        </Button>
                    ))}
                </FilterContainer>
            </Container>
            <SearchResult foodData={filterData} />
        </>
    );
};

export default App;

export const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;
const TopContainer = styled.section`
    min-height: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;

    .search {
        input {
            background-color: transparent;
            border: 1px solid red;
            color: white;
            border-radius: 5px;
            height: 40px;
            font-size: 1rem;
            padding: 0 10px;
            &::placeholder {
                color: white;
            }
        }
    }

    @media (0 < width < 600px) {
        flex-direction: column;
        row-gap: 10px;
        height: 120px;
    }
`;

const FilterContainer = styled.section`
    display: flex;
    justify-content: center;
    gap: 12px;
    padding-bottom: 30px;
`;

export const Button = styled.button`
    background-color: ${(props) => (props.$isSelected ? "#c32828" : "#ff4343")};
    outline: 2px solid ${(props) => (props.$isSelected ? "white" : "#ff4343")};
    border-radius: 5px;
    padding: 6px 12px;
    border: none;
    color: white;
    cursor: pointer;
    &:hover {
        background-color: #c32828;
    }
`;
