import styled from "styled-components";

export const Container = styled.div`
    background-color: #3d3f43;
    border-radius: 10px;
    padding: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    img {
        max-width: 100%;
        display: block;
        margin-bottom: 10px;
        border-radius: 10px;
    }

    input {
        position: absolute;
        left: 10px;
        top: 5px;
        color: #A00;
        cursor: pointer;

        &:hover {
            color: #f00;
        }
    }


`;