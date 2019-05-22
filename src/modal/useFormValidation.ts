import React from "react"


function userFormValidation( initialState: object ) {

    const [values, setValues] = React.useState( initialState )

    function handleChange( event: any ) {

        setValues({
           ...values,
           [event.target.name]: event.target.value
        })

        return { handleChange, values }

    }


}

export default userFormValidation