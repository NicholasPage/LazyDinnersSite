var ViewModel = function () {
    var self = this;
    self.url = window.location.href
    self.recipes = ko.observableArray([]);
    self.recipeCount = ko.observable(0);
    self.tableClass = ko.observable("d-none");
    self.recipeName = ko.observable();
    self.recipeIngredients = ko.observable();
	self.recipeSide_Ideas = ko.observable();
    self.recipeDifficulty = ko.observable();

    var apigateway = "https://h9b60a9ccd.execute-api.us-east-1.amazonaws.com/lazy_recipe_grabber";
    var tableVis = "container overflow-auto contentbox w-75";
    
    var displayValue = function(element, valueAccessor){
        var value = ko.utils.unwrapObservable(valueAccessor());
        var isCurrentlyVisible = !(element.style.display == "none");
        if(value && !isCurrentlyVisible)
        element.style.display = "";
        else if((!value) && isCurrentlyVisible)
        element.style.display = "none";
    };


    ko.bindingHandlers['loading-animation'] = {

        'init' : function(element, valueAccessor){
        $(element)
                .append(
                    '<div class="circle circle1 circle1-1"><div class="circle circle1 circle2-1"><div class="circle circle1 circle3-1"></div></div></div>');

        displayValue(element, valueAccessor);
        },
        'update' : function(element, valueAccessor){
        displayValue(element, valueAccessor);
        }
    };

    IsLoading = ko.observable(true);

    self.filterRecipes = function() {
        var filterData = {
            "name": self.recipeName(),
            "ingredients": self.recipeIngredients(),
			"side_ideas": self.recipeSide_Ideas(),
            "difficulty": self.recipeDifficulty(),
        };
        fetch(apigateway+'?filters='+JSON.stringify(filterData))
        .then(response => response.json())
        .then(data => self.recipes(data));
    };

    fetch(apigateway)
        .then(response => response.json())
        .then(data => self.recipes(data));
    

    setInterval(function() {
        self.recipeCount(self.recipes().length)
        if (self.recipes().length > 0) {
            IsLoading(false);
            self.tableClass(tableVis);
        }
    }, 3000);
    
  };

ko.applyBindings(new ViewModel());