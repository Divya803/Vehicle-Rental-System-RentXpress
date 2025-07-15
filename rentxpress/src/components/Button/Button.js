import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";


const StyledButton = styled(Button)(( props ) => {
    const red = props.red === 'true' ? true : false
    if( props.outlined === 'true' ){
        return {
            color: red ? '#ff0000' : '#00A8A8',
            '&:hover': {
                backgroundColor: red ? '#FF00001A' : '#00A8A81A',
            },
            '&.MuiButton-root': {
                width: '100%',
                height: '34px',
            },
            '&.Mui-disabled': {
                color: red ? '#ff0000 !important' : '#00A8A8 !important',
                borderColor: red ? '#ff0000 !important' : '#00A8A8 !important', 
                opacity: '0.4',
            },
            textTransform: 'none',
            fontSize: '16px',
            fontWeight:'400',
            // fontFamily: 'inter',
            borderRadius:'10px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: red ? '#ff0000' : '00A8A8'
        }
    }else{
        return {
            color: '#ffffff',
            backgroundColor: red ? '#D60202' : '#00A8A8',
            '&:hover': {
                backgroundColor: red ? '#FF0000' : '#00a87e',
            },
            '&.MuiButton-root': {
                width: '100%',
                height: '34px'
            },
            '&.Mui-disabled': {
                opacity: '0.3',
                color: '#ffffff !important'
            },
            transition: 'opacity 0.3s ease-in-out',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight:'500',
            // fontFamily: 'inter',
            borderRadius:'10px',
        }
    }
    
    
});

export default function ButtonMUI(props){
    return (
        <StyledButton
            style={props.style}
            onClick={props.onClick}
            outlined={props.outlined ? 'true' : 'false'}
            red={props.red ? 'true' : 'false'}
            disabled={props.disabled && props.disabled}
            id={props.id}
        >
            {props.icon && <span className="icon">{props.icon}</span>}
            {props.value}
        </StyledButton>
    )
}









