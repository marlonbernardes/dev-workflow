local source = debug.getinfo(1, "S").source:sub(2)
local config = vim.env.NVIM_TEST_CONFIG
  or vim.fs.joinpath(vim.fs.dirname(vim.fs.dirname(source)), "config", "nvim", "init.lua")
local root = vim.fn.tempname()
local vault = vim.fs.joinpath(root, "vault")
vim.fn.mkdir(vim.fs.joinpath(vault, "notes"), "p")
local project = vim.fs.joinpath(vault, "projects", "2026-11-19-sample project")
vim.fn.mkdir(project, "p")
vim.env.NOTE_WORKSPACE = vault

local function path(name)
  return vim.fs.joinpath(vault, name)
end

local original = {
  "---",
  "type: task",
  "id: TEST-001",
  "status: backlog",
  "custom: preserve-me",
  "---",
  "# Start",
  "[[Target Note]]",
  "[[notes/Target Note|Display label]]",
  "[[notes/Target Note#Details]]",
  "[[Missing Note]]",
}
vim.fn.writefile(original, path("Start.md"))
vim.fn.writefile({ "# Target Note", "", "## Details", "", "Content." }, path("notes/Target Note.md"))
vim.fn.writefile({ "# Sample project" }, vim.fs.joinpath(project, "PROJECT.md"))
vim.fn.writefile({ "# Outside the vault" }, vim.fs.joinpath(root, "outside.md"))

local ok, err = xpcall(function()
  vim.cmd.runtime("plugin/netrwPlugin.vim")
  vim.cmd("filetype plugin indent on")
  dofile(config)
  assert(vim.v.errmsg == "", vim.v.errmsg)
  vim.cmd.edit(vim.fn.fnameescape(path("Start.md")))
  assert(vim.wait(10000, function()
    for _, client in ipairs(vim.lsp.get_clients({ bufnr = 0, name = "obsidian-ls" })) do
      if client.initialized then
        return true
      end
    end
    return false
  end), "Obsidian LSP did not attach to the configured workspace")
  assert(vim.fn.maparg("<CR>", "n", false, true).buffer == 1, "Enter mapping missing")
  assert(not Obsidian.opts.ui.enable, "Conflicting Markdown UI enabled")
  vim.cmd.write()
  assert(vim.deep_equal(vim.fn.readfile(path("Start.md")), original), "Frontmatter changed on save")

  local function at_file(name)
    return vim.fs.normalize(vim.api.nvim_buf_get_name(0)) == vim.fs.normalize(path(name))
  end
  local function keys(value)
    vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes(value, true, false, true), "xt", false)
  end
  for _, line in ipairs({ 8, 9, 10 }) do
    vim.api.nvim_win_set_cursor(0, { line, 5 })
    keys("<CR>")
    assert(vim.wait(10000, function() return at_file("notes/Target Note.md") end), "Enter failed at line " .. line)
    if line == 10 then
      assert(vim.api.nvim_win_get_cursor(0)[1] == 3, "Heading link did not jump to Details")
    end
    keys("<C-o>")
    assert(at_file("Start.md"), "Ctrl+o failed to return to source")
    if line == 8 then
      keys("<C-i>")
      assert(at_file("notes/Target Note.md"), "Ctrl+i failed to go forward")
      keys("<C-o>")
      assert(at_file("Start.md"), "Ctrl+o failed after forward navigation")
    end
  end

  local api = require("obsidian.api")
  local confirm = api.confirm
  local prompted = false
  api.confirm = function()
    prompted = true
    return "No"
  end
  vim.api.nvim_win_set_cursor(0, { 11, 5 })
  require("obsidian.actions").follow_link()
  assert(vim.wait(10000, function() return prompted end), "Missing note did not prompt")
  api.confirm = confirm
  assert(at_file("Start.md"), "Cancelled navigation changed the current note")
  assert(vim.fn.filereadable(path("Missing Note.md")) == 0, "Cancelled link created a note")

  vim.cmd.edit(vim.fn.fnameescape(vim.fs.joinpath(root, "outside.md")))
  assert(vim.fn.maparg("<CR>", "n") == "", "Obsidian Enter mapping leaked outside vault")

  vim.cmd.cd(vim.fn.fnameescape(vault))
  vim.cmd.edit(vim.fn.fnameescape(vim.fs.joinpath(project, "PROJECT.md")))
  require("neo-tree.command").execute({ action = "focus", dir = vault, reveal_file = project })
  assert(vim.wait(10000, function()
    local state = require("neo-tree.sources.manager").get_state("filesystem")
    local node = state.tree and state.tree:get_node()
    return node and vim.fs.normalize(node:get_id()) == vim.fs.normalize(project)
  end), "Neo-tree did not focus the project folder")
  local tree = require("neo-tree.sources.manager").get_state("filesystem")
  assert(vim.fs.normalize(tree.path) == vim.fs.normalize(vault), "Neo-tree root changed to the project")
  assert(vim.fs.normalize(vim.fn.getcwd()) == vim.fs.normalize(vault), "Neovim changed the workspace directory")
  assert(vim.v.errmsg == "", vim.v.errmsg)
end, debug.traceback)

vim.fn.delete(root, "rf")
if not ok then
  vim.api.nvim_err_writeln(err)
  vim.cmd("cquit 1")
else
  print("PASS: wiki navigation and metadata preserved; project focused in Neo-tree with workspace root and cwd unchanged")
  vim.cmd("qa!")
end
