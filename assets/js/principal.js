$(document).on('ready', function() {
    Waves.init();
    Waves.attach('button', null, true);
});

var idPessoaGlobal = 0;


Vue.component('listPessoas', {
    data() {
        return {
            info: null,
            loading: true,
        }
    },
    mounted() {
        this.attData();
    },
    methods: {
        attData: function() {
            axios
                .get('http://5c9d09be3be4e30014a7d331.mockapi.io/nofaro/api/v1/person')
                .then(response => {
                    this.info = this.sortFunc(response.data);
                })
                .catch(function(error) {
                    console.log(error);
                })
                .finally(() => this.loading = false);
        },
        sortFunc: function(arrP) {
            return arrP.slice().sort(function(a, b) {
                return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1;
            });
        },
        emitComponent: function(component, id) {
            this.$emit('event_child', component);
            idPessoaGlobal = id;
        },
        deletePessoa: function(id) {
            var aux = this;
            $.confirm({
                'message': 'Tem certeza que você deseja excluir esse perfil?',
                'buttons': {
                    'Sim': {
                        'class': '',
                        'action': function() {
                            axios
                                .delete('http://5c9d09be3be4e30014a7d331.mockapi.io/nofaro/api/v1/person/' + id)
                                .catch(function(error) {
                                    console.log(error);
                                })
                                .finally(() => aux.removeInfo(id));
                        }
                    },
                    'Não': {
                        'class': 'white',
                        'action': function() {} // Nothing to do in this case. You can as well omit the action property.
                    }
                }
            });


        },
        removeInfo: function(id) {
            for (var i = 0; i < this.info.length; i++) {
                if (this.info[i].id == id) {
                    this.info.splice(i, 1);
                    break;
                }
            }
        }
    },

    template: '<section><section class="top"><h1>Lista de pessoas</h1><button @click="emitComponent(\'createPessoa\')">+ Adicionar Perfil</button></section><section class="box"><span v-if="loading">Carregando</span><table><tr v-for="pessoa in info"><td @click="emitComponent(\'detailsPessoa\', pessoa.id)">{{pessoa.name}}</td><td>{{pessoa.email}}</td><td><i @click="emitComponent(\'editPessoa\', pessoa.id)" class="fas fa-edit"></i> <i @click="deletePessoa(pessoa.id)" class="far fa-trash-alt"></i></td></tr></table></section></section>'
});

Vue.component('detailsPessoa', {
    data() {
        return {
            info: null,
            loading: true,
            id: 0
        }
    },
    mounted() {
        axios
                .get('http://5c9d09be3be4e30014a7d331.mockapi.io/nofaro/api/v1/person/'+idPessoaGlobal)
                .then(response => {
                    this.info = response.data;
                })
                .catch(function(error) {
                    console.log(error);
                })
                .finally(() => this.loading = false);
    },
    methods: {
        emitComponent: function(component, id) {
            this.$emit('event_child', component);
            idPessoaGlobal = id;
        },
        deletePessoa: function(id) {
            var aux = this;
            $.confirm({
                'message': 'Tem certeza que você deseja excluir esse perfil?',
                'buttons': {
                    'Sim': {
                        'class': '',
                        'action': function() {
                            axios
                                .delete('http://5c9d09be3be4e30014a7d331.mockapi.io/nofaro/api/v1/person/' + id)
                                .catch(function(error) {
                                    console.log(error);
                                })
                                .finally(() => aux.emitComponent('listPessoas',0));
                        }
                    },
                    'Não': {
                        'class': 'white',
                        'action': function() {} // Nothing to do in this case. You can as well omit the action property.
                    }
                }
            });


        }
    },

    template: '<section><section class="top"><h1><a @click="emitComponent(\'listPessoas\')"><i class="fas fa-arrow-left"></i></a> Perfil de <span v-if="!loading">{{info.name}}</span></h1></section><section class="box"><span v-if="loading">Carregando</span><span v-else><div class="float"><i @click="emitComponent(\'editPessoa\', info.id)" class="fas fa-edit"></i> <i @click="deletePessoa(info.id)" class="far fa-trash-alt"></i></div><img :src="info.avatar" align="middle" /><h2>{{info.name}}</h2><br>Nome: {{info.name}}<br>E-mail: {{info.email}}<br>Data de cadastro:{{info.createdAt}}</span></section></section>'
});

Vue.component('editPessoa', {
    props: {
    open: 552,
  },
    data() {
        return {
            info: null,
            loading: true,
            id: 0,
            nomePessoa: "",
            emailPessoa: "",
        }
    },
    mounted() {
        axios
                .get('http://5c9d09be3be4e30014a7d331.mockapi.io/nofaro/api/v1/person/'+idPessoaGlobal)
                .then(response => {
                    this.info = response.data;
                    this.nomePessoa = this.info.name;
                    this.emailPessoa = this.info.email;
                })
                .catch(function(error) {
                    console.log(error);
                })
                .finally(() => this.loading = false);
    },
    methods: {
        emitComponent: function(component, id) {
            this.$emit('event_child', component);
            idPessoaGlobal = id;
        },
        deletePessoa: function(id) {
            var aux = this;
            $.confirm({
                'message': 'Tem certeza que você deseja excluir esse perfil?',
                'buttons': {
                    'Sim': {
                        'class': '',
                        'action': function() {
                            axios
                                .delete('http://5c9d09be3be4e30014a7d331.mockapi.io/nofaro/api/v1/person/' + id)
                                .catch(function(error) {
                                    console.log(error);
                                })
                                .finally(() => aux.emitComponent('listPessoas',0));
                        }
                    },
                    'Não': {
                        'class': 'white',
                        'action': function() {} // Nothing to do in this case. You can as well omit the action property.
                    }
                }
            });


        },
        submitForm: function(e) {
            if (nomePessoa._value == "" || emailPessoa._value == "") {
                $.confirm({
                    'message': 'Preencha os dados',
                    'buttons': {
                        'Ok': {
                            'class': '',
                            'action': function() {}
                        }
                    }
                });
            } else {
                axios
                    .put('http://5c9d09be3be4e30014a7d331.mockapi.io/nofaro/api/v1/person/'+idPessoaGlobal, {
                        name: nomePessoa._value,
                        email: emailPessoa._value
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
                    .finally(() => this.$emit('event_child', 'listPessoas'),
                        $.confirm({
                            'message': 'Usuário editado',
                            'buttons': {
                                'Ok': {
                                    'class': '',
                                    'action': function() {}
                                }
                            }
                        })
                    );

            }
            e.preventDefault();
        }
    },

    template: '<section><section class="top"><h1><a @click="emitComponent(\'listPessoas\',0)"><i class="fas fa-arrow-left"></i></a> Editar perfil</h1></section><section class="box"><span v-if="loading">Carregando</span><span v-else><div class="float"><i @click="deletePessoa(info.id)" class="far fa-trash-alt"></i></div><img :src="info.avatar" align="middle" /><h2>{{info.name}}</h2><form id="app" @submit="submitForm" method="post" novalidate="true"><label for="nomePessoa">Nome:</label> <input id="nomePessoa" v-model="nomePessoa" placeholder="Inserir nome"><label for="emailPessoa">Email:</label> <input id="emailPessoa" v-model="emailPessoa" placeholder="Inserir email"><button>Salvar</button></form></section></section>'
});

Vue.component('createPessoa', {
    data() {
        return {
            nomePessoa: "",
            emailPessoa: "",
        }
    },
    methods: {
        emitComponent: function(component) {
            this.$emit('event_child', component);
        },

        submitForm: function(e) {
            if (nomePessoa._value == "" || emailPessoa._value == "") {
                $.confirm({
                    'message': 'Preencha os dados',
                    'buttons': {
                        'Ok': {
                            'class': '',
                            'action': function() {}
                        }
                    }
                });
            } else {
                axios
                    .post('http://5c9d09be3be4e30014a7d331.mockapi.io/nofaro/api/v1/person', {
                        name: nomePessoa._value,
                        email: emailPessoa._value
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
                    .finally(() => this.$emit('event_child', 'listPessoas'),
                        $.confirm({
                            'message': 'Usuário inserido',
                            'buttons': {
                                'Ok': {
                                    'class': '',
                                    'action': function() {}
                                }
                            }
                        })
                    );

            }
            e.preventDefault();
        }
    },
    template: '<section><section class="top"><h1><a @click="emitComponent(\'listPessoas\')"><i class="fas fa-arrow-left"></i></a> Novo perfil</h1></section><section class="box"><form id="app" @submit="submitForm" method="post" novalidate="true"><label for="nomePessoa">Nome:</label> <input id="nomePessoa" v-model="nomePessoa" placeholder="Inserir nome"><label for="emailPessoa">Email:</label> <input id="emailPessoa" v-model="emailPessoa" placeholder="Inserir email"><button>Salvar</button></form></section></section>'
})

const parent = new Vue({
    el: 'main',
    data() {
        return {
            currentComponent: 'listPessoas'
        }
    },
    mounted() {

    },
    methods: {
        swapComponent: function(component) {
            this.currentComponent = component;
        },
        changeComponent: function(component) {
            this.currentComponent = component;
        },
    }
});