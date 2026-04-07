// Glass Inventory Management System
class GlassInventory {
    constructor() {
        this.inventory = this.loadInventory();
        this.predefinedModels = [
            'Realme 5','F19','6i','9i','Note 9 Pro','C55','MI 12',
            'Samsung A35 / M35 / F35','CE2 Lite','Note 9','Nothing CMF',
            'Nothing 2A / 2A+','Nothing 3A / 3A Pro','Reno 13 / 14',
            'V20','V20 Pro','Samsung A30','5 Pro','Y91','Y19','Y11 / Y12',
            'Samsung F15','Note 7','Vivo S1','Redmi 9A','Redmi 10C',
            'Redmi 14C','Samsung A26','Samsung A14','Realme C53',
            'Samsung S20','iPhone 11','iPhone 12','iPhone 13',
            'iPhone 14 Pro','iPhone 16 Pro','iPhone 11 Pro Max',
            'iPhone 12 Pro Max','iPhone 13 Pro Max','iPhone 15 Pro',
            'iPhone 16 Pro Max'
        ];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.registerServiceWorker();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js');
        }
    }

    setupEventListeners() {
        document.getElementById('addBtn').onclick = () => this.showAddModal();
        document.getElementById('removeBtn').onclick = () => this.showRemoveModal();
        document.getElementById('addVariantBtn').onclick = () => this.showAddVariantModal();
        document.getElementById('listBtn').onclick = () => this.showListModal();

        document.querySelector('.close').onclick = () => this.closeModal();
        window.onclick = (e) => {
            if (e.target === document.getElementById('modal')) {
                this.closeModal();
            }
        };
    }

    loadInventory() {
        return JSON.parse(localStorage.getItem('glassInventory')) || {};
    }

    saveInventory() {
        localStorage.setItem('glassInventory', JSON.stringify(this.inventory));
    }

    showModal(title, content) {
        document.getElementById('modalBody').innerHTML = `
            <div class="modal-header"><h2>${title}</h2></div>
            <div class="modal-body">${content}</div>
        `;
        document.getElementById('modal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('modal').style.display = 'none';
    }

    // ---------------- ADD ----------------
    showAddModal() {
        const allModels = [...new Set([...this.predefinedModels, ...Object.keys(this.inventory)])];

        const content = `
            <input id="search" placeholder="Search model..." oninput="glassInventory.filterOptions()"><br><br>
            <select id="modelSelect">
                ${allModels.map(m => `<option value="${m}">${m}</option>`).join('')}
            </select><br><br>
            <input id="qty" type="number" value="1"><br><br>
            <button onclick="glassInventory.add()">Add</button>
        `;

        this.showModal("Add Item", content);
    }

    filterOptions() {
        const search = document.getElementById("search").value.toLowerCase();
        const options = document.getElementById("modelSelect").options;

        for (let opt of options) {
            opt.style.display = opt.value.toLowerCase().includes(search) ? "" : "none";
        }
    }

    add() {
        const m = modelSelect.value;
        const q = parseInt(qty.value);

        if (!m || q <= 0) return alert("Invalid");

        this.inventory[m] = (this.inventory[m] || 0) + q;

        this.saveInventory();
        this.closeModal();
    }

    // ---------------- REMOVE ----------------
    showRemoveModal() {
        const models = Object.keys(this.inventory);

        const content = `
            <select id="rmodel">
                ${models.map(m => `<option value="${m}">${m} (${this.inventory[m]})</option>`).join('')}
            </select><br><br>
            <input id="rqty" type="number" value="1"><br><br>
            <button onclick="glassInventory.remove()">Remove</button>
        `;

        this.showModal("Remove Item", content);
    }

    remove() {
        const m = rmodel.value;
        const q = parseInt(rqty.value);

        if (!this.inventory[m]) return alert("Not found");

        this.inventory[m] -= q;

        // ✅ FIX: DO NOT DELETE WHEN ZERO
        if (this.inventory[m] < 0) {
            this.inventory[m] = 0;
        }

        this.saveInventory();
        this.closeModal();
    }

    // ---------------- ADD VARIANT ----------------
    showAddVariantModal() {
        const content = `
            <input id="vname" placeholder="New Model"><br><br>
            <input id="vqty" type="number" value="1"><br><br>
            <button onclick="glassInventory.addVariant()">Add</button>
        `;

        this.showModal("Add Variant", content);
    }

    addVariant() {
        const m = vname.value.trim();
        const q = parseInt(vqty.value);

        if (!m || q < 0) return alert("Invalid");

        this.inventory[m] = q;

        this.saveInventory();
        this.closeModal();
    }

    // ---------------- LIST ----------------
    showListModal() {
        const allModels = [...new Set([...this.predefinedModels, ...Object.keys(this.inventory)])].sort();

        let tableRows = '';

        allModels.forEach(model => {
            const quantity = this.inventory[model] || 0;

            tableRows += `
                <tr>
                    <td>${model}</td>
                    <td>${quantity === 0 ? '<span style="color:red;">Out of Stock</span>' : quantity}</td>
                    <td>
                        <button onclick="glassInventory.editItem('${model}')">✏️</button>
                        <button onclick="glassInventory.deleteItem('${model}')">🗑️</button>
                    </td>
                </tr>
            `;
        });

        const content = `
            <input id="listSearch" placeholder="Search..." oninput="glassInventory.searchList()"><br><br>
            <table id="inventoryTable">
                <tr>
                    <th>Model</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                </tr>
                ${tableRows}
            </table>
        `;

        this.showModal('Inventory List', content);
    }

    searchList() {
        const s = document.getElementById("listSearch").value.toLowerCase();
        const rows = document.querySelectorAll("#inventoryTable tr");

        rows.forEach((row, i) => {
            if (i === 0) return;
            row.style.display = row.innerText.toLowerCase().includes(s) ? "" : "none";
        });
    }

    // ---------------- EDIT ----------------
    editItem(oldName) {
        const newName = prompt("Edit name:", oldName);

        if (!newName || newName.trim() === "") return;

        if (this.inventory[newName]) {
            alert("Item already exists!");
            return;
        }

        this.inventory[newName] = this.inventory[oldName];
        delete this.inventory[oldName];

        this.saveInventory();
        this.showListModal();
    }

    // ---------------- DELETE ----------------
    deleteItem(model) {
        const confirmDelete = confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;

        delete this.inventory[model];

        this.saveInventory();
        this.showListModal();
    }
}

const glassInventory = new GlassInventory();
