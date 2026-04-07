class GlassInventory {
    constructor() {
        this.inventory = JSON.parse(localStorage.getItem('glassInventory')) || {};
        this.predefinedModels = [
            'Realme 5','F19','6i','9i','Note 9 Pro','C55','MI 12',
            'Samsung A35 / M35 / F35','CE2 Lite','Note 9','Nothing CMF',
            'Nothing 2A / 2A+','Nothing 3A / 3A Pro','Reno 13 / 14'
        ];
        this.init();
    }

    init() {
        document.getElementById('addBtn').onclick = () => this.showAddModal();
        document.getElementById('removeBtn').onclick = () => this.showRemoveModal();
        document.getElementById('addVariantBtn').onclick = () => this.showAddVariantModal();
        document.getElementById('listBtn').onclick = () => this.showListModal();

        document.querySelector('.close').onclick = () => this.closeModal();
    }

    save() {
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

    // ================= ADD =================
    showAddModal() {
        const allModels = [...new Set([...this.predefinedModels, ...Object.keys(this.inventory)])];

        const content = `
            <div class="form-group">
                <label>Search Model</label>
                <input id="search" placeholder="Search..." oninput="glassInventory.filterOptions()">
            </div>

            <div class="form-group">
                <label>Select Model</label>
                <select id="modelSelect">
                    ${allModels.map(m => `<option value="${m}">${m}</option>`).join('')}
                </select>
            </div>

            <div class="form-group">
                <label>Quantity</label>
                <input id="qty" type="number" value="1">
            </div>

            <button class="btn" onclick="glassInventory.add()">Add Item</button>
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
        this.save();
        this.closeModal();
    }

    // ================= REMOVE =================
    showRemoveModal() {
        const models = Object.keys(this.inventory);

        const content = `
            <div class="form-group">
                <label>Select Model</label>
                <select id="rmodel">
                    ${models.map(m => `<option value="${m}">${m} (${this.inventory[m]})</option>`).join('')}
                </select>
            </div>

            <div class="form-group">
                <label>Quantity</label>
                <input id="rqty" type="number" value="1">
            </div>

            <button class="btn btn-danger" onclick="glassInventory.remove()">Remove</button>
        `;

        this.showModal("Remove Item", content);
    }

    remove() {
        const m = rmodel.value;
        const q = parseInt(rqty.value);

        if (!this.inventory[m]) return alert("Not found");

        this.inventory[m] -= q;

        // FIX: don't delete item
        if (this.inventory[m] < 0) this.inventory[m] = 0;

        this.save();
        this.closeModal();
    }

    // ================= ADD VARIANT =================
    showAddVariantModal() {
        const content = `
            <div class="form-group">
                <label>New Model</label>
                <input id="vname" placeholder="Enter model">
            </div>

            <div class="form-group">
                <label>Quantity</label>
                <input id="vqty" type="number" value="1">
            </div>

            <button class="btn" onclick="glassInventory.addVariant()">Add Variant</button>
        `;

        this.showModal("Add Variant", content);
    }

    addVariant() {
        const m = vname.value.trim();
        const q = parseInt(vqty.value);

        if (!m || q < 0) return alert("Invalid");

        this.inventory[m] = q;
        this.save();
        this.closeModal();
    }

    // ================= LIST =================
    showListModal() {
        const allModels = [...new Set([...this.predefinedModels, ...Object.keys(this.inventory)])].sort();

        let rows = '';

        allModels.forEach(m => {
            const q = this.inventory[m] || 0;
            const rowClass = q === 0 ? 'zero-stock' : '';
            const quantityClass = q === 0 ? 'quantity-badge zero' : 'quantity-badge';

            rows += `
                <tr class="${rowClass}">
                    <td>${m}</td>
                    <td><span class="${quantityClass}">${q}</span></td>
                    <td class="action-buttons">
                        <button class="edit-btn" onclick="glassInventory.editItem('${m}')">✏️</button>
                        <button class="delete-btn" onclick="glassInventory.deleteItem('${m}')">🗑️</button>
                    </td>
                </tr>
            `;
        });

        const content = `
            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input id="listSearch" placeholder="Search..." oninput="glassInventory.searchList()">
            </div>

            <table class="inventory-table" id="inventoryTable">
                <tr>
                    <th>Model</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                </tr>
                ${rows}
            </table>
        `;

        this.showModal("Inventory List", content);
    }

    searchList() {
        const s = document.getElementById("listSearch").value.toLowerCase();
        const rows = document.querySelectorAll("#inventoryTable tr");

        rows.forEach((row, i) => {
            if (i === 0) return;
            row.style.display = row.innerText.toLowerCase().includes(s) ? "" : "none";
        });
    }

    // ================= EDIT =================
    editItem(oldName) {
        const newName = prompt("Edit name:", oldName);
        if (!newName || newName.trim() === "") return;

        if (this.inventory[newName]) return alert("Already exists");

        this.inventory[newName] = this.inventory[oldName];
        delete this.inventory[oldName];

        this.save();
        this.showListModal();
    }

    // ================= DELETE =================
    deleteItem(name) {
        if (!confirm("Are you sure you want to delete this item?")) return;

        delete this.inventory[name];
        this.save();
        this.showListModal();
    }
}

const glassInventory = new GlassInventory();
