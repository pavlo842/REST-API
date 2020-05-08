import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'

// Создание компонента со спинером
Vue.component('loader', {
    template: `
        <div style="display: flex; justify-content: center; align-items: center;">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    `
})

new Vue({
    el: '#app',
    data() {
        return {
            loading: false, // Для спинера
            form: {
                name: '',
                value: ''
            },
            contacts: [],
        }
    },
    computed: {
        canCreate() {
            return this.form.value.trim() && this.form.name.trim();
        }
    },
    methods: {
        async createContact() { // для создания делается async
            const {...contact} = this.form;

            // далее запрос на создание
            const newContact = await request('/api/contacts', 'POST', contact);
            
            this.contacts.push(newContact); // получен newContact и запушен в массив contacts
            
            this.form.name = this.form.value = '';
        },
        async markContact(id) {
            const contact = this.contacts.find(c => c.id === id);
            const upd = await request(`/api/contacts/${id}`, 'PUT', {
                ...contact, // spread
                marked: true,
            });
            contact.marked = upd.marked;
        },
        async removeContact(id) {
            await request(`/api/contacts/${id}`, 'DELETE'); // Удаление на ВЕ
            this.contacts = this.contacts.filter(c => c.id !== id); // Если на ВЕ удалено, то удаление элемента на FE
        }
    },
    // метод mounted() - вызывается когда компонент готов
    async mounted() {
        // console.log('Ready');
        this.loading = true;
        this.contacts = await request('/api/contacts'); // получение данных с ВЕ и запись их в this.contacts
                                                        // если не один и тот же порт то нужно указывать 'http://localhost:3000/.......'
        this.loading = false;
    }
});

// Функция для запроса к серверу

async function request(url, method = 'GET', data = null) {
    try {
        const headers = {};
        let body;

        if (data) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        });
        return await response.json();
    } catch (e) {
        console.warn('Error', e.message);        
    }
}
