// 商店组件
var Shop = {
	template: '#tpl_shop',
	// 更新的数据，首先要绑定
	data: function() {
		return {
			shop: {},
			menu: [
				{id: 'product', text: '商品'},
				{id: 'evaluate', text: '评价'},
				{id: 'seller', text: '商家'}
			]
		}
	},
	// 组件创建完成
	created: function() {
		// 路由告诉我们是哪家店铺，请求地址与路由有关
		this.$http.get('data/' + this.$route.params.storeName + '.json')
			.then(function(res) {
				// 请求成功，存储数据
				if (res.data.errno === 0) {
					this.shop = res.data.data
				}
			})
	}
}
// 商品页面组件
var Product = {
	template: '#tpl_product',
	// 存储的数据要先定义
	data: function() {
		return {
			nav: []
		}
	},
	// 请求导航的数据
	created: function() {
		this.$http.get('data/menu.json?store=' + this.$route.params.storeName)
			.then(function(res) {
				// 请求成功，存储数据
				if (res.data.errno === 0) {
					this.nav = res.data.data
				}	
			})
	}
}
// 产品详情组件
var Food = {
	template: '#tpl_food',
	// 绑定数据
	data: function() {
		return {
			list: [],
			// 缓存所有类型的数据
			all: {}
		}
	},
	// 定义事件回调函数
	methods: {
		add: function(item) {
			// 跟新item的num值
			item.num++;
		},
		// 减少数量
		reduce: function(item) {
			item.num--;
		}
	},
	// 请求数据
	created: function() {
		var id = this.$route.params.foodId || '01'
		this.$http.get('data/' + id + '.json')
			.then(function(res) {
				// 请求成功，保存数据
				if (res.data.errno === 0) {
					this.list = res.data.data;
					// 缓存数据
					this.all[id] = res.data.data;
				}
			})
	},
	// watch可以监听实例化对象上的任何属性的变化
	watch: {
		'$route': function() {
			// 请求新的数据
			var id = this.$route.params.foodId || '01'
			// 判断数据是否在缓存中，不在，请求
			if (!this.all[id]) {
				this.$http.get('data/' + id + '.json')
					.then(function(res) {
						// 请求成功，保存数据
						if (res.data.errno === 0) {
							this.list = res.data.data;
						}
					})
			} else {
				// 在，读取缓存
				this.list = this.all[id]
			}
			
			
		}
	}
}
// 第一步 定义规则
var routes = [
	{
		path: '/store/:storeName',
		component: Shop,
		// 子路由
		children: [
			// 商品子路由
			{
				path: 'product',
				component: Product,
				// 定义子路由
				children: [
					{
						path: 'food/:foodId',
						component: Food
					}
				]
			}
			// ,{
			// 	path: 'evaluate',
			// 	component: Evaluate
			// }
		]
	},
	// 针对我们的项目定义默认路由
	// {
	// 	path: '*',
	// 	redirect: '/store/dks/product/01'
	// }
]
// 定义store
var store = new Vuex.Store({
	// 定义状态数据
	state: {
		num: 0
	},
	mutations: {
		// 增加价格
		add: function(state, num) {
			state.num += +num;
		},
		// 减少价格
		reduce: function(state, num) {
			state.num -= num;
		}
	}
})
// 第二步 实例化
var router = new VueRouter({
	routes: routes
})
// 第三步 注册
var app = new Vue({
	el: '#app',
	// 注册路由
	router: router,
	// 注册store
	store: store
})