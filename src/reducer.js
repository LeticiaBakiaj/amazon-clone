export const initialState = {
    basket: [],
    user: null

};
//selector

export const getBasketTotal =(basket) =>
  basket?.reduce((amount, item) => item.price + amount, 0);


const reducer = ( state, action ) => {

    console.log(action);
    switch(action.type){
        case 'ADD_TO_BASKET':
            return{
                ...state,
                basket: [...state.basket, action.item],
            };

         case 'EMPTY_BASKET':
              return {
                 ...state,
                 basket:[]
             }
//heqim nga  koshi, fshihet vetem el me index perkates
            case "REMOVE_FROM_BASKET":
                const index = state.basket.findIndex(
                    (basketItem) => basketItem.id ===action.id
                );

                let newBasket=[...state.basket];// ne cfaredo gjendje qe te jete basket, kapim nje te ri
                 
                if(index >=0 ){

                    newBasket.splice(index, 1);//heq nje element nga koshi i ri qe eshte kopje i te vjetrit

                }else{
                    console.warn(`Cant remove product (id: ${action.id}) as its not in basket!`
                    
                    )
                }

                return {
                    ...state,
                    basket: newBasket
                }

                case "SET_USER":
                    return{
                        ...state,
                        user: action.user
                    }
            default:
                return state;
    }
};

export default reducer;
