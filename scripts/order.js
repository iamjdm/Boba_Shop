/**
 * Order Management & Shopping Cart System
 * Handles product display, cart management, and checkout functionality
 */

const CHAT_API_URL = `${API_BASE}/api/chat`;
const ORDER_AI_API_URL = `${API_BASE}/api/order-ai`;

const PRODUCTS = {
	drinks: [
		{
			id: "classic-milk-tea",
			name: "Classic Milk Tea",
			desc: "Traditional black tea with creamy milk and chewy tapioca pearls.",
			sizes: [
				{ label: "Regular", price: 5.5, menuItemID: 1 },
				{ label: "Large", price: 6.5, menuItemID: 2 },
			],
			emoji: "🧋",
			tags: ["milk tea", "classic"],
		},
		{
			id: "taro-bliss",
			name: "Taro Bliss",
			desc: "Sweet taro root blended with milk and your choice of toppings.",
			sizes: [
				{ label: "Regular", price: 6.0, menuItemID: 3 },
				{ label: "Large", price: 7.0, menuItemID: 4 },
			],
			emoji: "🫐",
			tags: ["taro", "milk tea"],
		},
		{
			id: "matcha-zen",
			name: "Matcha Zen",
			desc: "Premium Japanese matcha with oat milk and honey boba.",
			sizes: [
				{ label: "Regular", price: 6.75, menuItemID: 5 },
				{ label: "Large", price: 7.75, menuItemID: 6 },
			],
			emoji: "🍵",
			tags: ["matcha", "green tea"],
		},
		{
			id: "strawberry-cloud",
			name: "Strawberry Cloud",
			desc: "Fresh strawberries blended with jasmine tea, topped with sweet cheese foam.",
			sizes: [
				{ label: "Regular", price: 6.5, menuItemID: 7 },
				{ label: "Large", price: 7.5, menuItemID: 8 },
			],
			emoji: "🍓",
			tags: ["fruit", "jasmine"],
		},
		{
			id: "brown-sugar-tiger",
			name: "Brown Sugar Tiger",
			desc: "House-made brown sugar syrup swirled with fresh milk and chewy pearls.",
			sizes: [
				{ label: "Regular", price: 6.25, menuItemID: 9 },
				{ label: "Large", price: 7.25, menuItemID: 10 },
			],
			emoji: "🐯",
			tags: ["brown sugar", "milk tea"],
		},
	],
	snacks: [
		{
			id: "mochi-set",
			name: "Mochi Trio",
			desc: "Three pieces of handmade mochi in rotating seasonal flavors.",
			sizes: [{ label: "3 pcs", price: 5.0, menuItemID: 11 }],
			emoji: "🍡",
			tags: ["mochi", "dessert"],
		},
		{
			id: "taiyaki",
			name: "Taiyaki",
			desc: "Fish-shaped waffle pastry filled with red bean, Nutella, or custard.",
			sizes: [
				{ label: "1 pc", price: 3.5, menuItemID: 12 },
				{ label: "3 pcs", price: 9.0, menuItemID: 13 },
			],
			emoji: "🐟",
			tags: ["pastry", "sweet"],
		},
		{
			id: "poke-bowl",
			name: "Poké Bowl",
			desc: "Fresh tuna or tofu over seasoned rice with avocado, edamame, and sesame.",
			sizes: [{ label: "Regular", price: 12.95, menuItemID: 14 }],
			emoji: "🥗",
			tags: ["poke", "savory"],
		},
		{
			id: "summer-rolls",
			name: "Summer Rolls",
			desc: "Two rice paper rolls with shrimp or tofu, fresh herbs, and rice noodles.",
			sizes: [{ label: "2 pcs", price: 7.5, menuItemID: 15 }],
			emoji: "🌿",
			tags: ["rolls", "fresh"],
		},
	],
	merch: [
		{
			id: "teazen-tee",
			name: "TeaZen Zen Vibes Tee",
			desc: "100% organic cotton. S–XL. Wear in-store for 10% off your drink!",
			sizes: [
				{ label: "S", price: 18.95, menuItemID: 16 },
				{ label: "M", price: 18.95, menuItemID: 17 },
				{ label: "L", price: 18.95, menuItemID: 18 },
				{ label: "XL", price: 18.95, menuItemID: 19 },
			],
			emoji: "👕",
			tags: ["shirt", "apparel"],
		},
		{
			id: "boba-tumbler",
			name: "TeaZen Boba Tumbler",
			desc: "20oz tumbler with wide boba straw. Keeps drinks cold for hours. Bring in for 10% off!",
			sizes: [{ label: "20oz", price: 14.95, menuItemID: 20 }],
			emoji: "🥤",
			tags: ["tumbler", "drinkware"],
		},
	],
};

let cart = [],
	selectedSizes = {},
	selectedQtys = {};
const CART_WIDTH = 290; // px — must match #cart-panel width in CSS

function allProducts() {
	return [...PRODUCTS.drinks, ...PRODUCTS.snacks, ...PRODUCTS.merch];
}

function renderProducts(category) {
	const grid = document.getElementById(`${category}-grid`);
	grid.innerHTML = PRODUCTS[category]
		.map((p) => renderCard(p, category))
		.join("");
	PRODUCTS[category].forEach((p) => {
		selectedSizes[p.id] = 0;
		selectedQtys[p.id] = 1;
	});
}

function renderCard(p, category) {
	const sizeButtons = p.sizes
		.map(
			(s, i) =>
				`<button class="size-btn ${i === 0 ? "selected" : ""}" data-pid="${p.id}" onclick="selectSize('${p.id}', ${i})">${s.label}</button>`,
		)
		.join("");
	const priceDisplay =
		p.sizes.length === 1
			? `$${p.sizes[0].price.toFixed(2)}`
			: `$${p.sizes[0].price.toFixed(2)} – $${p.sizes[p.sizes.length - 1].price.toFixed(2)}`;
	return `
		<div class="product-card">
			<div class="card-image">${p.emoji}</div>
			<div class="card-body">
				<div class="card-name">${p.name}</div>
				<div class="card-desc">${p.desc}</div>
				<div class="card-price" id="price-${p.id}">${priceDisplay}</div>
				${p.sizes.length > 1 ? `<div class="size-options">${sizeButtons}</div>` : ""}
				<textarea class="custom-request" id="custom-${p.id}" placeholder="Special request (e.g. no ice, extra syrup)..." rows="2"></textarea>
				<div class="card-actions">
					<div class="qty-control">
						<button class="qty-btn" onclick="changeQty('${p.id}', -1)">−</button>
						<span class="qty-num" id="qty-${p.id}">1</span>
						<button class="qty-btn" onclick="changeQty('${p.id}', 1)">+</button>
					</div>
					<button class="add-btn" id="addbtn-${p.id}" onclick="addToCart('${p.id}', '${category}')">Add to Cart</button>
				</div>
			</div>
		</div>`;
}

function selectSize(pid, idx) {
	selectedSizes[pid] = idx;
	document
		.querySelectorAll(`.size-btn[data-pid="${pid}"]`)
		.forEach((btn, i) => btn.classList.toggle("selected", i === idx));
	const p = allProducts().find((x) => x.id === pid);
	if (p) {
		document.getElementById(`price-${pid}`).textContent =
			`$${p.sizes[idx].price.toFixed(2)}`;
	}
}

function changeQty(pid, delta) {
	selectedQtys[pid] = Math.max(1, (selectedQtys[pid] || 1) + delta);
	document.getElementById(`qty-${pid}`).textContent = selectedQtys[pid];
}

function addToCart(pid, category) {
	const p = allProducts().find((x) => x.id === pid);
	if (!p) return;

	const sizeIdx = selectedSizes[pid] ?? 0;
	const size = p.sizes[sizeIdx];
	const qty = selectedQtys[pid] || 1;
	const custom = document.getElementById(`custom-${pid}`)?.value?.trim() || "";
	const key = `${pid}::${sizeIdx}::${custom}`;
	const existing = cart.find((i) => i._key === key);

	if (existing) {
		existing.quantity += qty;
	} else {
		cart.push({
			_key: key,
			id: pid,
			menuItemID: size.menuItemID,
			category,
			name: p.name,
			emoji: p.emoji,
			size: size.label,
			unitPrice: size.price,
			quantity: qty,
			customRequest: custom,
			tags: p.tags,
		});
	}

	updateCartUI();
	flashAddBtn(pid);
	showToast(`Added ${qty}× ${p.name} (${size.label})`);

	selectedQtys[pid] = 1;
	document.getElementById(`qty-${pid}`).textContent = 1;
}

function flashAddBtn(pid) {
	const btn = document.getElementById(`addbtn-${pid}`);
	if (!btn) return;

	btn.classList.add("added");
	btn.textContent = "✓ Added!";

	setTimeout(() => {
		btn.classList.remove("added");
		btn.textContent = "Add to Cart";
	}, 1400);
}

function setChatPosition(cartOpen) {
	const bubble = document.getElementById("chat-bubble");
	const panel = document.getElementById("chat-panel-float");
	const offset = cartOpen ? `calc(${CART_WIDTH}px + 1.5em)` : "1.5em";

	if (bubble) bubble.style.right = offset;
	if (panel) panel.style.right = offset;
}

function updateCartUI() {
	const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
	const totalPrice = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

	const setEl = (id, val) => {
		const el = document.getElementById(id);
		if (el) el.textContent = val;
	};

	setEl("cart-count", totalItems);
	setEl("cart-total", `$${totalPrice.toFixed(2)}`);
	setEl("topbar-total", `$${totalPrice.toFixed(2)}`);
	setEl(
		"cart-item-count",
		`(${totalItems} item${totalItems !== 1 ? "s" : ""})`,
	);

	const hasItems = cart.length > 0;
	document.getElementById("checkout-btn").disabled = !hasItems;
	document.getElementById("export-lm-btn").disabled = !hasItems;

	const cartPanel = document.getElementById("cart-panel");
	const productsCol = document.getElementById("products-col");

	if (hasItems) {
		positionCartPanel();
		cartPanel.classList.add("cart-visible");
		productsCol.classList.add("cart-open");
		setChatPosition(true);
	} else {
		cartPanel.classList.remove("cart-visible");
		productsCol.classList.remove("cart-open");
		setChatPosition(false);
	}

	const cartEl = document.getElementById("cart-items");
	if (!hasItems) {
		cartEl.innerHTML =
			'<p class="cart-empty">Your cart is empty.<br>Add something delicious! 🧋</p>';
		return;
	}

	cartEl.innerHTML =
		`<p class="cart-panel-title">Your items</p>` +
		cart
			.map(
				(item, idx) => `
			<div class="cart-item">
				<div class="cart-item-thumb">${item.emoji}</div>
				<div class="cart-item-info">
					<div class="cart-item-name">${item.name}</div>
					<div class="cart-item-meta">${item.size} · $${item.unitPrice.toFixed(2)} ea</div>
					${item.customRequest ? `<div class="cart-item-custom">📝 ${item.customRequest}</div>` : ""}
					<div class="cart-item-controls">
						<button class="cart-qty-btn" onclick="cartChangeQty(${idx}, -1)">−</button>
						<span class="cart-qty-num">${item.quantity}</span>
						<button class="cart-qty-btn" onclick="cartChangeQty(${idx}, 1)">+</button>
					</div>
				</div>
				<span class="cart-item-line">$${(item.unitPrice * item.quantity).toFixed(2)}</span>
				<button class="remove-item" onclick="removeItem(${idx})" title="Remove">✕</button>
			</div>
		`,
			)
			.join("");
}

function positionCartPanel() {
	const cartPanel = document.getElementById("cart-panel");
	const orderTopbar = document.getElementById("order-topbar");
	if (!cartPanel || !orderTopbar) return;

	const topbarBottom = orderTopbar.getBoundingClientRect().bottom;
	cartPanel.style.top = topbarBottom + "px";
	cartPanel.style.height = window.innerHeight - topbarBottom + "px";
}

window.addEventListener(
	"scroll",
	() => {
		if (cart.length > 0) positionCartPanel();
	},
	{ passive: true },
);

window.addEventListener("resize", () => {
	if (cart.length > 0) {
		positionCartPanel();
		setChatPosition(true);
	} else {
		setChatPosition(false);
	}
});

function removeItem(idx) {
	cart.splice(idx, 1);
	updateCartUI();
}

function cartChangeQty(idx, delta) {
	cart[idx].quantity = Math.max(1, cart[idx].quantity + delta);
	updateCartUI();
}

function openMobileCart() {
	document.getElementById("cart-overlay").classList.add("open");
	setChatPosition(true);
}

function closeMobileCart() {
	document.getElementById("cart-overlay").classList.remove("open");
	setChatPosition(cart.length > 0);
}

function toggleChat() {
	document.getElementById("chat-panel-float").classList.toggle("open");
}

let toastTimer;
function showToast(msg) {
	const t = document.getElementById("toast");
	t.textContent = msg;
	t.classList.add("show");
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

async function checkout() {
	if (!cart.length) return;

	const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

	const orderNotes = document.getElementById("order-notes").value.trim();

	const orderData = {
		customerID: 1,
		paymentMethod: "Card",
		totalAmount: parseFloat(subtotal.toFixed(2)),
		items: cart.map((item) => {
			const parts = [item.customRequest, orderNotes].filter(Boolean);
			return {
				menuItemID: item.menuItemID,
				quantity: item.quantity,
				item_price: parseFloat(item.unitPrice.toFixed(2)),
				specialRequest: parts.join(" | "),
			};
		}),
	};

	try {
		const response = await fetch(`${API_BASE}/submit-order`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(orderData)
		});

		const result = await response.json();

		if (result.success) {
			alert(`Order placed! 🎉\n\nOrder ID: ${result.orderID}\nTotal: $${orderData.totalAmount}`);
			cart = [];
			updateCartUI();
			closeMobileCart();
			document.getElementById("order-notes").value = "";
			document.querySelectorAll(".custom-request").forEach((el) => (el.value = ""));
		} else {
			alert("Error: " + result.error);
		}
	} catch (error) {
		console.error("Checkout error:", error);
		alert("Something went wrong while submitting the order.");
	}
}

function buildOrderPayload() {
	const notes = document.getElementById("order-notes").value.trim();
	const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

	return {
		timestamp: new Date().toISOString(),
		location: "TeaZen Boba Bar — 12010 Garret Bay Road, Ellison Bay, WI 54210",
		orderNotes: notes,
		items: cart.map((item) => ({
			productId: item.id,
			name: item.name,
			category: item.category,
			size: item.size,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
			lineTotal: parseFloat((item.unitPrice * item.quantity).toFixed(2)),
			customRequest: item.customRequest || null,
			tags: item.tags,
		})),
		itemCount: cart.reduce((s, i) => s + i.quantity, 0),
		subtotal: parseFloat(subtotal.toFixed(2)),
	};
}

async function sendChatMessage() {
	const input = document.getElementById("chat-input");
	const messages = document.getElementById("chat-messages");

	if (!input || !messages) return;

	const text = input.value.trim();
	if (!text) return;

	const userMsg = document.createElement("div");
	userMsg.className = "chat-msg chat-msg-user";
	userMsg.textContent = text;
	messages.appendChild(userMsg);

	input.value = "";
	messages.scrollTop = messages.scrollHeight;

	const thinkingMsg = document.createElement("div");
	thinkingMsg.className = "chat-msg chat-msg-bot";
	thinkingMsg.textContent = "Thinking...";
	messages.appendChild(thinkingMsg);
	messages.scrollTop = messages.scrollHeight;

	try {
		const response = await fetch(CHAT_API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: text }),
		});

		const data = await response.json();

		setTimeout(() => {
			thinkingMsg.textContent =
				data.reply || "Sorry, I couldn't answer that right now.";
			messages.scrollTop = messages.scrollHeight;
		}, 300);
	} catch (e) {
		setTimeout(() => {
			thinkingMsg.textContent = "Couldn't connect to TeaZen assistant.";
			messages.scrollTop = messages.scrollHeight;
		}, 300);
		console.error(e);
	}
}

async function sendToLM(payload) {
	try {
		const response = await fetch(ORDER_AI_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		const data = await response.json();

		if (data.reply) {
			showToast("Payload sent to AI!");
			alert(data.reply);
		} else {
			showToast("Payload sent.");
		}
	} catch (error) {
		console.error(error);
		showToast("Could not send payload to local API.");
	}
}

function showLMPayload() {
	document.getElementById("lm-payload-code").textContent = JSON.stringify(
		buildOrderPayload(),
		null,
		2,
	);
	document.getElementById("lm-modal").classList.add("open");
}

function closeLMModal() {
	document.getElementById("lm-modal").classList.remove("open");
}

function copyPayload() {
	navigator.clipboard
		.writeText(document.getElementById("lm-payload-code").textContent)
		.then(() => {
			showToast("JSON copied!");
			closeLMModal();
		});
}

document.querySelectorAll(".tab-btn").forEach((btn) => {
	btn.addEventListener("click", () => {
		document
			.querySelectorAll(".tab-btn")
			.forEach((b) => b.classList.remove("active"));
		document
			.querySelectorAll(".category-panel")
			.forEach((p) => p.classList.remove("active"));

		btn.classList.add("active");
		document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
	});
});

renderProducts("drinks");
renderProducts("snacks");
renderProducts("merch");
updateCartUI();