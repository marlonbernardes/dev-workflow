local source = debug.getinfo(1, "S").source:sub(2)
local config = vim.env.NVIM_TEST_CONFIG
  or vim.fs.joinpath(vim.fs.dirname(vim.fs.dirname(source)), "config", "nvim", "init.lua")
local root = vim.fn.tempname()
vim.fn.mkdir(root, "p")
vim.env.NOTE_WORKSPACE = root
local file = vim.fs.joinpath(root, "tracked.md")
local baseline = {}
for i = 1, 20 do
  baseline[i] = "Line " .. i
end

local function git(args)
  local command = { "git", "-C", root }
  vim.list_extend(command, args)
  local result = vim.system(command, { text = true }):wait()
  assert(result.code == 0, result.stderr)
  return result.stdout
end

local function keys(value)
  vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes(value, true, false, true), "xt", false)
end

local ok, err = xpcall(function()
  git({ "init", "-q" })
  vim.fn.writefile(baseline, file)
  git({ "add", "--", "tracked.md" })
  dofile(config)
  assert(vim.v.errmsg == "", vim.v.errmsg)
  vim.cmd.cd(vim.fn.fnameescape(root))
  vim.cmd.edit(vim.fn.fnameescape(file))
  local gs = require("gitsigns")
  assert(vim.wait(10000, function()
    return vim.b.gitsigns_head ~= nil and vim.fn.maparg(" gd", "n") ~= ""
  end), "Gitsigns did not attach or install buffer-local shortcuts")
  vim.api.nvim_buf_set_lines(0, 2, 3, false, { "Changed first hunk" })
  vim.api.nvim_buf_set_lines(0, 17, 18, false, { "Changed second hunk" })
  assert(vim.wait(10000, function() return #(gs.get_hunks() or {}) == 2 end), "Expected two Git hunks")

  vim.api.nvim_win_set_cursor(0, { 1, 0 })
  keys("]c")
  assert(vim.wait(10000, function() return vim.fn.line(".") == 3 end), "Next hunk shortcut failed")
  keys("]c")
  assert(vim.wait(10000, function() return vim.fn.line(".") == 18 end), "Second hunk navigation failed")
  keys("[c")
  assert(vim.wait(10000, function() return vim.fn.line(".") == 3 end), "Previous hunk shortcut failed")

  local editor = vim.api.nvim_get_current_win()
  keys(" gp")
  assert(vim.wait(10000, function()
    for _, win in ipairs(vim.api.nvim_list_wins()) do
      if vim.api.nvim_win_get_config(win).relative ~= "" then
        vim.api.nvim_win_close(win, true)
        return true
      end
    end
    return false
  end), "Hunk preview shortcut failed")
  keys(" gd")
  assert(vim.wait(10000, function() return #vim.api.nvim_list_wins() == 2 end), "Diff shortcut did not open a split")
  local comparison
  for _, win in ipairs(vim.api.nvim_list_wins()) do
    assert(vim.wo[win].diff, "Comparison window is not in diff mode")
    if win ~= editor then
      comparison = win
    end
  end
  assert(vim.deep_equal(vim.api.nvim_buf_get_lines(vim.api.nvim_win_get_buf(comparison), 0, -1, false), baseline),
    "Diff comparison does not match the Git index")
  vim.api.nvim_win_close(comparison, true)
  vim.api.nvim_set_current_win(editor)

  vim.api.nvim_win_set_cursor(0, { 3, 0 })
  keys(" gs")
  assert(vim.wait(10000, function()
    return git({ "show", ":tracked.md" }):find("Changed first hunk", 1, true) ~= nil
  end), "Stage hunk shortcut did not update the temporary Git index")
  assert(vim.wait(10000, function() return #(gs.get_hunks() or {}) == 1 end), "Staged hunk remained unstaged")
  vim.api.nvim_win_set_cursor(0, { 18, 0 })
  keys(" gr")
  assert(vim.wait(10000, function()
    return vim.api.nvim_buf_get_lines(0, 17, 18, false)[1] == baseline[18]
  end), "Discard hunk shortcut failed")
end, debug.traceback)

vim.cmd("silent! %bwipeout!")
vim.fn.delete(root, "rf")
if not ok then
  vim.api.nvim_err_writeln(err)
  vim.cmd("cquit 1")
else
  print("PASS: Gitsigns attachment, hunk navigation, preview, index diff, staging and discard")
  vim.cmd("qa!")
end
