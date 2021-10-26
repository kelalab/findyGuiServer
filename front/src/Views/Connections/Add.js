import { useState } from "react"
import { View, TextInput, Button } from "react-native"
import { H2 } from "../../Components/fonts"

export default ({request}) => {
    const [value, setvalue] = useState(null);
    return (
        <View>
            <H2>Add a connection</H2>
            <TextInput value={value} onChangeText={setvalue}/>
            <Button title="Confirm"></Button>
        </View>
    )
}