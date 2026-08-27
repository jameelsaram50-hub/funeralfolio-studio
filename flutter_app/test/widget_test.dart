import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/models/models.dart';
import 'package:flutter_app/theme/app_theme.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test('Memorial model serialization test', () {
    final memorial = Memorial(
      id: 'mem-test-1',
      name: 'Eleanor Vance',
      birthDate: '1942-04-14',
      deathDate: '2026-08-10',
      format: 'Bi-fold Program',
    );

    expect(memorial.name, 'Eleanor Vance');
    final json = memorial.toJson();
    expect(json['id'], 'mem-test-1');
    expect(json['name'], 'Eleanor Vance');

    final parsed = Memorial.fromJson(json);
    expect(parsed.name, 'Eleanor Vance');
    expect(parsed.id, 'mem-test-1');
  });

  test('Obituary model test', () {
    final obit = Obituary(
      id: 'obit-1',
      personName: 'Eleanor Vance',
      tone: 'Heartfelt',
      content: 'A cherished soul.',
    );

    expect(obit.personName, 'Eleanor Vance');
    expect(obit.content, 'A cherished soul.');
  });

  test('AppTheme configuration test', () {
    final theme = AppTheme.lightTheme;
    expect(theme.scaffoldBackgroundColor, AppColors.bgMain);
  });
}
