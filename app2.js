//Storage Controller
const StorageCtrl = (function(){
  //Public methods
  return {
    getItemsFromLS : function(){
      let items;
      if(localStorage.getItem('items')===null){
        items=[];
      }else{
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    addItemToLS : function(item){
      items = this.getItemsFromLS();
      items.push(item);
      localStorage.setItem('items',JSON.stringify(items));
    },
    updateItemToLS : function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id ===item.id)
        {
          items.splice(index, 1, updatedItem);
        }
      })

      localStorage.setItem('items',JSON.stringify(items));

    },
    deleteItemFromLS : function(id){
      items = this.getItemsFromLS();

      let index = 0;
      items.forEach(function(item){
        if(item.id===id){
          index = items.indexOf(item);
        }
      });
      items.splice(index, 1);

      localStorage.setItem('items',JSON.stringify(items));
    },
    clearAllItemFromLS : function(){
      // let items =this.getItemsFromLS();
      // items = [];
      // localStorage.setItem('items',JSON.stringify(items));

      localStorage.removeItem('items');
    }

  }
})();

//Item Controller
const ItemCtrl = (function(){
  //item Constructor
  const Item = function (id, name, calories){
    this.id= id;
    this.name= name;
    this.calories= calories;
  }
    const data = {
      // items : [
      //   // {id: 0, name: 'Burger', calories: 500},
      //   // {id: 0, name: 'Ice Cream', calories: 700},
      //   // {id: 0, name: 'Steak', calories: 1200}
      // ],
      items : StorageCtrl.getItemsFromLS(),
      currentItem : null,
      totalCalories : 0
    }
//Public Methods
    return {
        getItems : function(){
          return data.items;
        },
        addItem : function(name, calories){
          let ID;
          //Create new ID
          if(data.items.length>0){
            ID =  data.items[data.items.length - 1].id +1 ;
          }else{
            ID =0 ;
          }
          //Parse Calories to INT
          calories = parseInt(calories);
          //Create new Item
          newItem = new Item(ID, name, calories);

          //Add the new Item to the items array
          data.items.push(newItem);

          return newItem;
        },

        getItemById : function (id){
          //Return the Item with the passed ID
          let found = null;
          data.items.forEach(function(item){
            if(item.id ===id){
              found = item;
            }
          })
          // data.items.forEach(item=> item.id=id?found=item : foud=null)
          return found ;
        },
        updateItem : function (name, calories){
          //Calories to number
          calories=parseInt(calories);

          let found = null;
          data.items.forEach(function(item){
            if(item.id===data.currentItem.id){
              item.name = name;
              item.calories = calories;
              found = item;
            }
          })
          return found ;
        },

        deleteItem : function(id){
          let index = 0;
          data.items.forEach(function(item){
            if(item.id===id){
              index = data.items.indexOf(item);
            }
          });
          data.items.splice(index, 1);
        },
        updateIdsAfterDelete : function(idDeletedItem){
          const items = this.getItems();
          for (let i=idDeletedItem; i<items.length;i++){
            items[i].id -= 1;
          }
        },

        deleteAllItems : function(){
          data.items = [];
        },
        getCurrentItem : function(){
          return data.currentItem;
        },
        setCurrentItem : function(item){
          data.currentItem = item;
        },
        getTotalCalories : function(){
          let total = 0;
          data.items.forEach(function(item){
            total += item.calories;
          })
          //set total calories in data structures
          data.totalCalories = total;
          //return calories total
          return data.totalCalories;
        },

        logData: function(){
          return data;
        }
    }
})();

//UI Controller
const UICtrl = (function(){
    const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
    }
    //Public Methods
    return{
      populateItem : function(items){
        let html = '';
        items.forEach(function(item){
          html += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name} : </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
          `
        })
        //Add Lis to the list items
        document.querySelector(UISelectors.itemList).innerHTML = html;
      },
      getItemInput : function(){
        return {
          name: document.querySelector(UISelectors.itemNameInput).value,
          calories: document.querySelector(UISelectors.itemCaloriesInput).value
        }
      },
      addListItem : function(item){
        //Show List
        document.querySelector(UISelectors.itemList).style.display ='block'
        document.querySelector(UISelectors.itemList).innerHTML+=`
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name} : </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
        `
      },
      updateListItem : function(item){
        let listItems = document.querySelectorAll(UISelectors.listItems);

        //NodeList to array
        listItems = Array.from(listItems);
        listItems.forEach(function(listItem){
          const itemID = listItem.getAttribute('id');

          if(itemID ===`item-${item.id}`){
            document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name} : </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
            `
          }
        })
      },
      // deleteListItem : function(id){
      //
      // },
      clearInput : function(){
        document.querySelector(UISelectors.itemNameInput).value = '';
        document.querySelector(UISelectors.itemCaloriesInput).value = '';
      },
      addItemToForm : function(){
        document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
        document.querySelector(UISelectors.itemCaloriesInput).value =  ItemCtrl.getCurrentItem().calories;
      },
      removeItems : function(){
        document.querySelector(UISelectors.itemList).innerHTML = '';

        /*
        const items = document.querySelectorAll(UISelectors.listItems);

        //NodeList to Array
        items = Array.from(items);
        items.forEach(item => item.remove())
        */
      },
      hideList : function(){
        document.querySelector(UISelectors.itemList).style.display='none';
      },
      showTotalCalories : function(totalCalories){
        document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
      },
      clearEditState: function(){
        this.clearInput();
        document.querySelector(UISelectors.addBtn).style.display='inline';
        document.querySelector(UISelectors.updateBtn).style.display='none';
        document.querySelector(UISelectors.deleteBtn).style.display='none';
        document.querySelector(UISelectors.backBtn).style.display='none';
      },
      showEditState: function(){
        document.querySelector(UISelectors.addBtn).style.display='none';
        document.querySelector(UISelectors.updateBtn).style.display='inline';
        document.querySelector(UISelectors.deleteBtn).style.display='inline';
        document.querySelector(UISelectors.backBtn).style.display='inline';
      },
      getSelectors: function(){
          return UISelectors ;
      }
    }
})();

//App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl ){

    //Load Event Listeners
    const loadEventListeners = function(){
      //get UI selectors
      const UISelectors = UICtrl.getSelectors();

        //Load Items in list on page load
        //document.addEventListener('DOMContentLoaded', loadFromLS) ;

       //Add item event
      document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

      //Disable submit on enter
      document.addEventListener('keypress', function(e){
        if(e.keyCode===13 || e.which===13){
          e.preventDefault();
          return false;
        }
      })

      //Edit icon click Event
      document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

      //Update Item event
      document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

      //Delete Item event
      document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

      //Back button event
      document.querySelector(UISelectors.backBtn).addEventListener('click',backSubmit);

      //Clear all items event
      document.querySelector(UISelectors.clearBtn).addEventListener('click',clearItemsSubmit);

    }
    //
    // //Load From LS
    // const loadFromLS = function(){
    //   const items = StorageCtrl.getItemsFromLS();
    //
    // }

    //Add item submit
    const itemAddSubmit = function(e){
      //Get form Input from UI Controller
      const input = UICtrl.getItemInput();

      //Check for name and calories input
      if(input.name!==''&&input.calories!==''){

        input.calories = parseInt(input.calories);
        // //Add item
        const newItem = ItemCtrl.addItem(input.name,input.calories)

        //Add Item to UI list
        UICtrl.addListItem(newItem);
        //Add item to Local Storage
        StorageCtrl.addItemToLS(newItem);
        //Clear Input Fields
        UICtrl.clearInput();
      }
      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Show total Caloris in UI
      UICtrl.showTotalCalories(totalCalories);

      e.preventDefault();
    }

    // item edit click
    const itemEditClick = function(e){
      if(e.target.classList.contains('edit-item')){
        //Gte list item id
        const listId = e.target.parentNode.parentNode.id ;

        //Break into an array
        const listIdArray = listId.split('-');

        //Get the actual ID
        const id = parseInt(listIdArray[1]);

        //Get item
        const itemToEdit = ItemCtrl.getItemById(id);
      //  console.log(itemToEdit);

        //Set current item
        ItemCtrl.setCurrentItem(itemToEdit);

        //Add item to form
        UICtrl.addItemToForm();

        //Show Edit State
        UICtrl.showEditState();
      }
      e.preventDefault();
    }

    //Item update submit
    const itemUpdateSubmit = function(e){
        //Get item input
        const input = UICtrl.getItemInput();

        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update item in LS

        StorageCtrl.updateItemToLS(updatedItem);
        //Show Updated Item in UI
        UICtrl.updateListItem(updatedItem);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Show total Caloris in UI
        UICtrl.showTotalCalories(totalCalories);

        //Clear Edit State
        UICtrl.clearEditState();

        e.preventDefault();
    }

    //Item Delete Submit
    const itemDeleteSubmit = function(e){

      //Get current element ID
      const currentItemID = ItemCtrl.getCurrentItem().id ;
      //Item to delete
      const itemToDelete = ItemCtrl.getItemById(currentItemID);

      //Delete Item from item list
      ItemCtrl.deleteItem(itemToDelete.id);

      //Delete from LS
      StorageCtrl.deleteItemFromLS(itemToDelete.id);

      //Update items IDs
      ItemCtrl.updateIdsAfterDelete(itemToDelete.id);

      //Update UI
      const items = ItemCtrl.getItems();
      console.log(items);
      UICtrl.populateItem(items);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Show total Caloris in UI
      UICtrl.showTotalCalories(totalCalories);

      //Clear Efit State
      UICtrl.clearEditState();

      e.preventDefault();
    }

    //Back Button submit
    const backSubmit = function(e){
      //Clear Efit State
      UICtrl.clearEditState();

      e.preventDefault();
    }

    //Clear all items
    const clearItemsSubmit = function(e){
        const items = ItemCtrl.getItems();

        if(items.length>0){
          if(confirm('Are you sure, you want to delete all items ?') ){

            //Remove items from list
            ItemCtrl.deleteAllItems();

            //remove from local storag
            StorageCtrl.clearAllItemFromLS();

            //Remove from UI
            UICtrl.removeItems();

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Show total Caloris in UI
            UICtrl.showTotalCalories(totalCalories);

            //Hide List
            UICtrl.hideList();
          }
        }else if(items.length===0){
          alert('There are no items to delete.')
        }

      e.preventDefault();
    }

    //Public Methods
    return {
      init : function(){
        //Clear Edit state/ set inital state
        UICtrl.clearEditState();
        //Fetch Items from data structure
          const items = ItemCtrl.getItems();

          //Check if any items
          if(items.length === 0){
            UICtrl.hideList();
          }else{
            //populate Item List
            UICtrl.populateItem(items);
          }

          //Get total calories
          const totalCalories = ItemCtrl.getTotalCalories();
          //Show total Caloris in UI
          UICtrl.showTotalCalories(totalCalories);

        //Load Event Listeners
        loadEventListeners();
      }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

//Initialize App
App.init();
