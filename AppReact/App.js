import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from './Home'
import HistoricoScreen from './Historico'




const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  HistoricoLeituras: {screen: HistoricoScreen}
})


const App = createAppContainer(MainNavigator);
export default App;
