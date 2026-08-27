import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../services/memorial_state_service.dart';
import 'checkout_screen.dart';

class InvitationEditorScreen extends StatefulWidget {
  final String? initialThemeId;

  const InvitationEditorScreen({
    super.key,
    this.initialThemeId,
  });

  @override
  State<InvitationEditorScreen> createState() => _InvitationEditorScreenState();
}

class _InvitationEditorScreenState extends State<InvitationEditorScreen> {
  int _currentStep = 1;
  late String _selectedThemeId;

  late TextEditingController _nameController;
  late TextEditingController _birthDateController;
  late TextEditingController _deathDateController;
  late TextEditingController _serviceDateController;
  late TextEditingController _serviceLocationController;
  late TextEditingController _receptionController;
  late TextEditingController _rsvpController;
  late TextEditingController _photoUrlController;

  @override
  void initState() {
    super.initState();
    final draft = MemorialStateService.instance.draft;
    _selectedThemeId = widget.initialThemeId ?? draft.themeId ?? 'celestial-gold';

    _nameController = TextEditingController(text: draft.name);
    _birthDateController = TextEditingController(text: draft.birthDate ?? '1942');
    _deathDateController = TextEditingController(text: draft.deathDate ?? '2026');
    _serviceDateController = TextEditingController(text: draft.serviceDate ?? 'Saturday, October 24, 2026 at 2:00 PM');
    _serviceLocationController = TextEditingController(text: draft.serviceLocation ?? 'Grace Cathedral Chapel, San Francisco, CA');
    _receptionController = TextEditingController(text: 'Reception and fellowship immediately following in the Cathedral Hall.');
    _rsvpController = TextEditingController(text: 'Please RSVP by October 18 to family@memorial.org');
    _photoUrlController = TextEditingController(text: draft.photoUrl ?? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop');
  }

  void _syncToState() {
    MemorialStateService.instance.updateDraft(
      name: _nameController.text,
      birthDate: _birthDateController.text,
      deathDate: _deathDateController.text,
      serviceDate: _serviceDateController.text,
      serviceLocation: _serviceLocationController.text,
      photoUrl: _photoUrlController.text,
      themeId: _selectedThemeId,
      productId: 'invitation',
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _birthDateController.dispose();
    _deathDateController.dispose();
    _serviceDateController.dispose();
    _serviceLocationController.dispose();
    _receptionController.dispose();
    _rsvpController.dispose();
    _photoUrlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = MemorialThemes.getById(_selectedThemeId);

    return Scaffold(
      backgroundColor: AppColors.bgMain,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Customizing 5" x 7" Funeral Invitation',
              style: GoogleFonts.playfairDisplay(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Row(
              children: [
                Text(
                  '${theme.name} Theme • ',
                  style: GoogleFonts.inter(fontSize: 11, color: AppColors.textMuted),
                ),
                GestureDetector(
                  onTap: _showThemePickerModal,
                  child: Text(
                    'Change Theme',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppColors.accent,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('CANCEL', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textMuted)),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: ElevatedButton(
              onPressed: () {
                _syncToState();
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const CheckoutScreen()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              ),
              child: Text('Finalize', style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 12)),
            ),
          ),
        ],
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isWide = constraints.maxWidth >= 850;

          if (isWide) {
            return Row(
              children: [
                Expanded(
                  flex: 5,
                  child: Container(
                    padding: const EdgeInsets.all(24),
                    child: _buildLiveInvitationPreview(theme, isWide: true),
                  ),
                ),
                Expanded(
                  flex: 5,
                  child: Container(
                    margin: const EdgeInsets.fromLTRB(0, 16, 20, 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: _buildStepForm(),
                  ),
                ),
              ],
            );
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _buildLiveInvitationPreview(theme, isWide: false),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.borderSubtle),
                  ),
                  child: _buildStepForm(),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildLiveInvitationPreview(MemorialThemeConfig theme, {bool isWide = false}) {
    final previewContent = Container(
      width: 320,
      height: 480,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.accentColor, width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.12),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            'YOU ARE CORDIALLY INVITED TO CELEBRATE THE LIFE OF',
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(
              fontSize: 9,
              letterSpacing: 2,
              fontWeight: FontWeight.bold,
              color: theme.accentColor,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: theme.accentColor, width: 2),
            ),
            child: ClipOval(
              child: _photoUrlController.text.isNotEmpty
                  ? Image.network(
                      _photoUrlController.text,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Icon(Icons.person, size: 45, color: theme.accentColor),
                    )
                  : Icon(Icons.person, size: 45, color: theme.accentColor),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            _nameController.text.isNotEmpty ? _nameController.text : 'Honoree Name',
            textAlign: TextAlign.center,
            style: GoogleFonts.playfairDisplay(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: theme.textColor,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            '${_birthDateController.text} — ${_deathDateController.text}',
            style: GoogleFonts.inter(fontSize: 10, color: theme.textColor.withValues(alpha: 0.75)),
          ),
          const SizedBox(height: 12),
          Divider(color: theme.accentColor.withValues(alpha: 0.3), indent: 30, endIndent: 30),
          const SizedBox(height: 8),
          Text(
            'MEMORIAL SERVICE',
            style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.bold, color: theme.accentColor, letterSpacing: 1.5),
          ),
          const SizedBox(height: 3),
          Text(
            _serviceDateController.text,
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: theme.textColor),
          ),
          const SizedBox(height: 2),
          Text(
            _serviceLocationController.text,
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(fontSize: 9, color: theme.textColor.withValues(alpha: 0.8)),
          ),
          const SizedBox(height: 8),
          Text(
            _receptionController.text,
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(fontSize: 9, fontStyle: FontStyle.italic, color: theme.textColor.withValues(alpha: 0.75)),
          ),
          const SizedBox(height: 4),
          Text(
            _rsvpController.text,
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(fontSize: 8, fontWeight: FontWeight.w600, color: theme.accentColor),
          ),
        ],
      ),
    );

    if (isWide) {
      return Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.borderSubtle),
            ),
            child: Text(
              '5" x 7" SERVICE ANNOUNCEMENT PREVIEW',
              style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.accent, letterSpacing: 1),
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: Center(
              child: FittedBox(
                fit: BoxFit.contain,
                child: previewContent,
              ),
            ),
          ),
        ],
      );
    }

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.borderSubtle),
          ),
          child: Text(
            '5" x 7" SERVICE ANNOUNCEMENT PREVIEW',
            style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.accent, letterSpacing: 1),
          ),
        ),
        const SizedBox(height: 16),
        Center(
          child: FittedBox(
            fit: BoxFit.contain,
            child: previewContent,
          ),
        ),
      ],
    );
  }

  Widget _buildStepForm() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _currentStep == 1 ? 'Step 1: Honoree Info' : (_currentStep == 2 ? 'Step 2: Ceremony & Chapel' : 'Step 3: Reception & RSVP'),
            style: GoogleFonts.playfairDisplay(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: SingleChildScrollView(
              child: _buildCurrentStepFields(),
            ),
          ),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (_currentStep > 1)
                OutlinedButton(
                  onPressed: () => setState(() => _currentStep--),
                  child: const Text('Back'),
                )
              else
                const SizedBox.shrink(),
              ElevatedButton(
                onPressed: () {
                  _syncToState();
                  if (_currentStep < 3) {
                    setState(() => _currentStep++);
                  } else {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const CheckoutScreen()),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(_currentStep < 3 ? 'Next Step' : 'Finalize & Order Prints'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCurrentStepFields() {
    if (_currentStep == 1) {
      return Column(
        children: [
          _buildTextField('Honoree Full Name', _nameController),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: _buildTextField('Date of Birth', _birthDateController)),
              const SizedBox(width: 10),
              Expanded(child: _buildTextField('Date of Passing', _deathDateController)),
            ],
          ),
          const SizedBox(height: 12),
          _buildTextField('Portrait Image URL', _photoUrlController),
        ],
      );
    } else if (_currentStep == 2) {
      return Column(
        children: [
          _buildTextField('Service Date & Time', _serviceDateController),
          const SizedBox(height: 12),
          _buildTextField('Chapel Venue & Address', _serviceLocationController),
        ],
      );
    } else {
      return Column(
        children: [
          _buildTextField('Reception Note', _receptionController, maxLines: 3),
          const SizedBox(height: 12),
          _buildTextField('RSVP Instructions & Contact', _rsvpController),
        ],
      );
    }
  }

  Widget _buildTextField(String label, TextEditingController controller, {int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textDark)),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          maxLines: maxLines,
          style: GoogleFonts.inter(fontSize: 13),
          decoration: InputDecoration(
            filled: true,
            fillColor: AppColors.bgSurface,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.borderSubtle),
            ),
          ),
          onChanged: (_) => setState(() {}),
        ),
      ],
    );
  }

  void _showThemePickerModal() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Choose a Luxury Theme', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              ...MemorialThemes.all.map((t) {
                return ListTile(
                  leading: Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(color: t.accentColor, shape: BoxShape.circle),
                  ),
                  title: Text(t.name, style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
                  subtitle: Text(t.tagline, style: GoogleFonts.inter(fontSize: 11)),
                  trailing: _selectedThemeId == t.id ? const Icon(Icons.check, color: AppColors.accent) : null,
                  onTap: () {
                    setState(() => _selectedThemeId = t.id);
                    _syncToState();
                    Navigator.pop(context);
                  },
                );
              }),
            ],
          ),
        );
      },
    );
  }
}
