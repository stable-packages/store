var GlobalStore = ((e) => {
	function n(e) {
		return 'number' == typeof e ? [0, 0, e] : e.split('.').map((e) => Number.parseInt(e, 10))
	}
	function r(e, r, i, o) {
		const s = t(e, r)
		;((e, r) => {
			const t = e.map(n),
				i = n(r)
			return (
				((e, n) => !e.some((e) => e[0] === n[0]))(t, i) ||
				((e, n) => e.filter((e) => e[0] === n[0]).some((e) => n[1] > e[1] || (n[1] === e[1] && n[2] > e[2])))(t, i)
			)
		})(s.versions, i) && (s.initializers.push(o), (s.value = o(s.value, s.versions)), s.versions.push(i))
	}
	function t(e, n) {
		const r = (e[n.moduleName] = e[n.moduleName] || Object.create(null)),
			t = n.key ?? 'default'
		return (r[t] = r[t] || { versions: [], value: {}, initializers: [] })
	}
	function i(e, r, t, i) {
		;((e) =>
			e.sort((e, r) =>
				((e, r) => {
					const t = n(e),
						i = n(r)
					return t[0] !== i[0] ? t[0] - i[0] : t[1] !== i[1] ? t[1] - i[1] : t[2] - i[2]
				})(e.version, r.version)
			))(t).forEach(({ version: n, resolve: t, initializer: o }) =>
			t(i({ moduleName: e, key: r, version: n, initializer: o }))
		)
	}
	function o(e, n, r) {
		const i = t(e, n)
		i.value = r
			? Object.isFrozen(r)
				? r
				: Object.freeze(r)
			: ((e) => {
					if (Object.isFrozen(e)) throw TypeError('Frozen value cannot be freezed again')
					Object.keys(e).forEach((n) => s(e, n)),
						Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(e).forEach((n) => s(e, n))
					return Object.freeze(e)
				})(i.value)
	}
	function s(e, n) {
		const r = e[n]
		Array.isArray(r) && (e[n] = Object.freeze(r))
	}
	const u = Object.create(null)
	function c({ moduleName: e, key: n, version: i, initializer: s }) {
		const c = { moduleName: e, key: n }
		return (
			r(u, c, i, s),
			{
				get value() {
					return ((e, n) => t(e, n).value)(u, c)
				},
				freeze: (e) => o(u, c, e),
				reset: () =>
					((e, n) => {
						const r = t(e, n),
							i = r.versions
						;(r.versions = []),
							(r.value = r.initializers.reduce((e, n, t) => ((e = n(e, r.versions)), r.versions.push(i[t]), e), {}))
					})(u, c)
			}
		)
	}
	const a = Object.create(null)
	return (
		(e.createAsyncStore = async ({ moduleName: e, key: n, version: r, initializer: t }) =>
			new Promise((i) => {
				const o = (a[e] = a[e] || Object.create(null)),
					s = n ?? 'default'
				;(o[s] = o[s] || []).push({ version: r, resolve: i, initializer: t })
			})),
		(e.createStore = c),
		(e.default = c),
		(e.initializeAsyncStore = (e, n) => {
			const r = a[e]
			if (!r) return
			;(n ? [n] : Object.keys(r)).forEach((n) => i(e, n, r[n], c))
		}),
		Object.defineProperty(e, '__esModule', { value: !0 }),
		e
	)
})({})
//# sourceMappingURL=global-store.js.map
