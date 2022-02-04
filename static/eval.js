export function evalCode(frame, code) {
  const blob = new Blob(
    [
      `<!DOCTYPE html>
			<html>
				<head>
					<style>
						.info {color: blue;}
						.error {color: red;}
						.info::before,
						.error::before{content: "> "}
					</style>
				</head>
				<body>
					<script>
						function output(str, type) {
							const div = document.createElement("div")
							div.classList.add(type)
							div.innerText = str
							document.body.appendChild(div)
						}
						window.addEventListener("error", (e)=>{
							console.error(e)
							output(event.type + ": " + event.message, "error")
						})
						window.addEventListener("unhandledrejection", (e)=>{
							console.error(e)
							output(event.type + ": " + event.message, "error")
						})
						console.assert = (assert, ...msgs)=>assert||output(
							"assertion error: "+ msgs.join(" "),
							"error"
						)
						console.debug = (...args)=>output(args.join(" "), "info")
						console.log = (...args)=>output(args.join(" "), "info")
						console.info = (...args)=>output(args.join(" "), "info")
						console.error = (...args)=>output(args.join(" "), "error")
						console.warn = (...args)=>output(args.join(" "), "error")
					</script>
					<script type="module">
						import("data:text/javascript,${encodeURIComponent(code)}");
					</script>
				</body>
			</html>`,
    ],
    { type: "text/html" },
  );
  frame.src = URL.createObjectURL(blob);
}
