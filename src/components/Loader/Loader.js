import Spinner from "react-spinner-material";

export default function Loader(){
    return (
        <div style={{width:"100%",marginTop:"100px",display:"flex",justifyContent:"center"}}>
        <Spinner radius={50} color={"rgb(190, 140, 236)"} stroke={5} visible={true} />
        </div>
    )
}