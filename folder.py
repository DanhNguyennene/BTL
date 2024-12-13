import os
import fnmatch

# List of patterns to ignore
IGNORE_PATTERNS = [
    "logs", "*.log", "npm-debug.log*", "yarn-debug.log*", "yarn-error.log*",
    "pnpm-debug.log*", "lerna-debug.log*", "node_modules", "dist", "dist-ssr", 
    "*.local", ".vscode", ".idea", ".DS_Store", "*.suo", "*.ntvs*", "*.njsproj", 
    "*.sln", "*.sw?", "report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json", "pids", "*.pid", 
    "*.seed", "*.pid.lock", "lib-cov", "coverage", "*.lcov", ".nyc_output", ".grunt", 
    "bower_components", ".lock-wscript", "build/Release", "jspm_packages", "web_modules", 
    "*.tsbuildinfo", ".npm", ".eslintcache", ".stylelintcache", ".rpt2_cache/", ".rts2_cache_cjs/",
    ".rts2_cache_es/", ".rts2_cache_umd/", ".node_repl_history", "*.tgz", ".yarn-integrity", 
    ".env", ".env.development.local", ".env.test.local", ".env.production.local", ".env.local", 
    ".cache", ".parcel-cache", ".next", "out", ".nuxt", "dist", ".cache/", ".vuepress/dist", 
    ".temp", ".docusaurus", ".serverless/", ".fusebox/", ".dynamodb/", ".tern-port", 
    ".vscode-test", ".yarn/cache", ".yarn/unplugged", ".yarn/build-state.yml", 
    ".yarn/install-state.gz", ".pnp.*", ".env"
]

def is_ignored(path):
    """Check if a path matches any ignore pattern."""
    for pattern in IGNORE_PATTERNS:
        if fnmatch.fnmatch(path, pattern) or path.endswith(pattern):
            return True
    return False

def draw_folder_structure(path, indent_level=0):
    """Recursively prints the folder structure."""
    try:
        items = os.listdir(path)
    except PermissionError:
        print("Permission Denied:", path)
        return
    except FileNotFoundError:
        print("Directory not found:", path)
        return
    
    for item in items:
        item_path = os.path.join(path, item)
        
        # Skip the folder if it matches any ignore pattern
        if is_ignored(item_path):
            continue
        
        # If it's a directory, print it and recursively list its contents
        if os.path.isdir(item_path):
            print("    " * indent_level + f"📁 {item}")
            draw_folder_structure(item_path, indent_level + 1)
        else:
            print("    " * indent_level + f"📄 {item}")

if __name__ == "__main__":
    folder_path = './backend'
    print(f"Folder structure of {folder_path}:")
    draw_folder_structure(folder_path)
