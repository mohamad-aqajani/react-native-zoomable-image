import {ZoomableImage} from 'react-native-zoomable-image';
import {Dimentions} from 'react-native'

const width = Dimentions.get('window').width

export default function App() {
    return <SafeAreaView style={{flex:1}}>
        <ZoomableImage style={{width, height:400, alignSelf:'center', marginTop: 200}} 
        source={{uri:'https://images.unsplash.com/photo-1593642702909-dec73df255d7?ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw1MHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60'}}  />
    </SafeAreaView>
  }